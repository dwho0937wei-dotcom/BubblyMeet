const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User, Group, Membership, GroupImage, Sequelize, Venue, Event, Attendance, EventImage} = require('../../db/models');
const { userLoggedIn, restoreUser, requireAuth2, requireProperAuth } = require('../../utils/auth');
const { getUserFromToken, venueExists, eventExists, userExists } = require('../../utils/helper');
const { validateEvent, validateAttendance } = require('../../utils/validation');

const router = express.Router();

const queryBadRequest = function (res) {
    res.status(400);
    return res.json(
        {
            "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
            "errors": {
            "page": "Page must be greater than or equal to 1",
            "size": "Size must be greater than or equal to 1",
            "name": "Name must be a string",
            "type": "Type must be 'Online' or 'In Person'",
            "startDate": "Start date must be a valid datetime",
            }
        }
    );
}

// Delete attendance to an event specified by its id
router.delete('/:eventId/attendance/:userId', restoreUser, requireAuth2, eventExists, userExists, async (req, res) => {
    const loginUser = getUserFromToken(req);

    const { eventId, userId } = req.params;
    const event = await Event.findByPk(eventId);

    const groupId = event.dataValues.groupId;
    const group = await Group.findByPk(groupId);

    if (group.dataValues.organizerId !== loginUser.id && +userId !== loginUser.id) {
        return requireProperAuth(res);
    }

    const attendantToDelete = await Attendance.findOne({
        where: {eventId, userId}
    });
    if (!attendantToDelete) {
        res.status(404);
        return res.json({
            message: "Attendance does not exist for this User"
        })
    }

    res.status(200);
    await attendantToDelete.destroy();
    res.json({
        message: "Successfully deleted attendance from event"
    })
})

// Add an Image to an Event based on its id
router.post('/:eventId/images', restoreUser, requireAuth2, eventExists, async (req, res) => {
    const user = getUserFromToken(req);

    const eventId = +req.params.eventId;

    const userAttendance = await Attendance.findOne({
        where: { userId: user.id, eventId, status: { [Op.not]: 'pending' } }
    });
    if (!userAttendance) {
        return requireProperAuth(res);
    }

    const { url, preview } = req.body;
    const newEventImage = await EventImage.create({
        url, preview, eventId
    });
    // console.log(newEventImage);
    const payload = {
        id: newEventImage.dataValues.id,
        url: newEventImage.dataValues.url,
        preview: newEventImage.dataValues.preview
    }
    res.status(200);
    res.json(payload);
})

// Change the status of an attendance for an event specified by its id
router.put('/:eventId/attendance', restoreUser, requireAuth2, validateAttendance, eventExists, userExists, async (req, res) => {
    const loginUser = getUserFromToken(req);

    const eventId = req.params.eventId;
    const event = await Event.findByPk(eventId);

    const group = await event.getGroup();
    const coHost = await Membership.findOne({
        where: {userId: loginUser.id, groupId: group.id, status: 'co-host'}
    });
    if (group.dataValues.organizerId !== loginUser.id && !coHost) {
        return requireProperAuth(res);
    }

    const { userId, status } = req.body;

    const attendanceToUpdate = await Attendance.findOne(
        { where: { userId } }
    );
    if (!attendanceToUpdate) {
        res.status(404);
        return res.json({
            message: "Attendance between the user and the event does not exist"
        });
    }

    if (status === 'pending') {
        res.status(400);
        return res.json({
            "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
            "errors": {
                "status" : "Cannot change an attendance status to pending"
             }
        });
    }

    res.status(200);
    attendanceToUpdate.set({
        status
    });
    await attendanceToUpdate.save();
    const payload = {
        id: attendanceToUpdate.dataValues.id,
        eventId: attendanceToUpdate.dataValues.eventId,
        userId: attendanceToUpdate.dataValues.userId,
        status: attendanceToUpdate.dataValues.status
    };
    return res.json(payload);
})

// Request to attend an event based on its id
router.post('/:eventId/attendance', restoreUser, requireAuth2, eventExists, async (req, res) => {
    const user = getUserFromToken(req);

    const eventId = req.params.eventId;
    const event = await Event.findByPk(eventId);

    const groupId = event.dataValues.groupId;
    const sameMember = await Membership.findOne({
        where: {userId: user.id, groupId, status: { [Op.not]: 'pending' } }
    });
    if (!sameMember) {
        return requireProperAuth(res);
    }

    const sameAttendee = await Attendance.findOne({
        where: {userId: user.id, eventId}
    });
    if (sameAttendee) {
        res.status(400);
        const status = sameAttendee.dataValues.status;
        if (status === 'pending') {
            return res.json({
                message: "Attendance has already been requested"
            })
        }
        else {
            return res.json({
                message: "User is already an attendee of the event"
            })
        }
    }

    res.status(200);
    const newAttendee = await event.addAttendee(user.id, { through: { status: "pending" } });
    const payload = {
        userId: newAttendee[0].dataValues.userId,
        status: newAttendee[0].dataValues.status
    }
    res.json(payload);
})

// Get all attendees of an event specified by its id
router.get('/:eventId/attendees', eventExists, async (req, res) => {
    const eventId = req.params.eventId;
    const event = await Event.findByPk(eventId);

    res.status(200);
    const attendanceCriteria = {
        attributes: ['id', 'firstName', 'lastName'],
        joinTableAttributes: ['status']
    };
    const group = await event.getGroup();
    let user;
    if (userLoggedIn(req)) {
        user = getUserFromToken(req);
        const coHost = await Membership.findOne({
            where: {userId: user.id, groupId: event.dataValues.groupId, status: 'co-host'}
        });
        if (group.dataValues.organizerId !== user.id && !coHost) {
            attendanceCriteria.where = {
                '$Attendance.status$': {
                    [Op.notIn]: ['pending']
                } 
            }
        }
    }

    const attendants = await event.getAttendee(attendanceCriteria);
    return res.json({Attendees: attendants});
})

// Edit an event specified by its id
router.put('/:eventId', restoreUser, requireAuth2, validateEvent, venueExists, eventExists, async (req, res) => {
    const user = getUserFromToken(req);

    const eventId = req.params.eventId;
    const event = await Event.findByPk(eventId);
    const groupId = event.dataValues.groupId;
    const group = await Group.findByPk(groupId);
    
    const coHost = await Membership.findOne({
        where: {userId: user.id, groupId, status: 'co-host'}
    });
    if (group.dataValues.organizerId !== user.id && !coHost) {
        return requireProperAuth(res);
    }

    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    const venue = await Venue.findByPk(venueId);

    event.set({
        venueId, name, type, capacity, price, description, startDate, endDate
    });
    await event.save();
    res.status(200);
    const payload = {
        id: event.dataValues.id,
        venueId: event.dataValues.venueId,
        groupId: event.dataValues.groupId,
        name: event.dataValues.name,
        description: event.dataValues.description,
        type: event.dataValues.type,
        capacity: event.dataValues.capacity,
        price: event.dataValues.price,
        startDate: event.dataValues.startDate,
        endDate: event.dataValues.endDate
    }
    res.json(payload);
})

// Get details of an event specified by its id
router.get('/:eventId', eventExists, async (req, res) => {
    const eventId = req.params.eventId;
    const event = await Event.findByPk(eventId, {
        include: [
            {
                model: Group,
                attributes: ['id', 'name', 'private', 'city', 'state']
            },
            {
                model: Venue,
                attributes: ['id', 'address', 'city', 'state', 'lat', 'lng']
            },
            {
                model: EventImage,
                attributes: ['id', 'url', 'preview'],
                separate: true
            },
            {
                model: User,
                as: 'Attendee',
                attributes: []
            }
        ],
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
            include: [[Sequelize.fn("COUNT", Sequelize.col("Attendee.id")), 'numAttending']]
        }
    });

    res.status(200);
    return res.json(event);
})

// Delete an event specified by its id
router.delete('/:eventId', restoreUser, requireAuth2, eventExists, async (req, res) => {
    const user = getUserFromToken(req);

    const eventId = req.params.eventId;
    const event = await Event.findByPk(eventId);
    const groupId = event.dataValues.groupId;
    const group = await Group.findByPk(groupId);
    
    const coHost = await Membership.findOne({
        where: {userId: user.id, groupId, status: 'co-host'}
    });
    if (group.dataValues.organizerId !== user.id && !coHost) {
        return requireProperAuth(res);
    }

    await event.destroy();
    res.status(200);
    res.json({
        message: "Successfully deleted"
    });
})

// Get all events
router.get('/', async (req, res) => {
    // Setting up the criteria for finding all the events
    const eventCriteria = {
        include: [
            {
                model: Group,
                attributes: ['id', 'name', 'city', 'state']
            },
            {
                model: Venue,
                attributes: ['id', 'city', 'state']
            },
        ],
        attributes: [
            'id',
            'groupId',
            'venueId',
            'name',
            'type',
            'startDate',
            'endDate',
    // Aggregating
            [
                Sequelize.literal('(SELECT COUNT(*) FROM Attendances WHERE Attendances.eventId = Event.id)'),
                'numAttending'
            ],
    // Extracting
            [
                Sequelize.literal('(SELECT url FROM EventImages WHERE preview = true AND eventId = Event.id)'),
                'previewImage'
            ]
        ]
    };

    // Getting the query
    let { page, size, name, type, startDate } = req.query;

    // Setting the page and size
    if (!page || page > 10) page = 1;
    if (!size || size > 20) size = 20;
    if (page < 1 || size < 1) return queryBadRequest(res);
    // Applying the page and size
    eventCriteria.limit = size;
    eventCriteria.offset = size * (page - 1);

    // If there exist any name, type, or startDate,
        // then filter events matching these attributes.
    eventCriteria.where = {};
    if (name) eventCriteria.where.name = name;
    if (type) eventCriteria.where.type = type;
    if (startDate) eventCriteria.where.startDate = startDate;

    // Finding and paginating all events
    res.status(200);
    const events = await Event.findAll(eventCriteria);
    return res.json({Events: events});
})

module.exports = router;