const express = require('express');
const { Op } = require('sequelize');

const { User, Group, Membership, Sequelize, Venue, Event, Attendance, EventImage } = require('../../db/models');
const { userLoggedIn, restoreUser, requireAuth2, requireProperAuth, partOfAnEvent, hostOrCohostOfGroup } = require('../../utils/auth');
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
router.post('/:eventId/images', restoreUser, requireAuth2, eventExists, partOfAnEvent, async (req, res) => {
    const eventId = +req.params.eventId;
    const { url, preview } = req.body;
    const newEventImage = await EventImage.create({
        url, preview, eventId
    });
    const payload = {
        id: newEventImage.dataValues.id,
        url: newEventImage.dataValues.url,
        preview: newEventImage.dataValues.preview
    }
    res.status(200).json(payload);
})

// Change the status of an attendance for an event specified by its id
router.put('/:eventId/attendance', restoreUser, requireAuth2, validateAttendance, eventExists, userExists, hostOrCohostOfGroup, async (req, res) => {
    const { userId, status } = req.body;

    const attendanceToUpdate = await Attendance.findOne(
        { where: { userId } }
    );
    if (!attendanceToUpdate) {
        return res.status(404).json({
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

    await attendanceToUpdate.set({ status }).save();
    return res.status(200).json({
        id: attendanceToUpdate.id,
        eventId: attendanceToUpdate.eventId,
        userId: attendanceToUpdate.userId,
        status: attendanceToUpdate.status
    });
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
    return res.status(200).json({Attendees: attendants});
})

// Edit an event specified by its id
router.put('/:eventId', restoreUser, requireAuth2, validateEvent, venueExists, eventExists, hostOrCohostOfGroup, async (req, res) => {
    const eventId = +req.params.eventId;
    const event = await Event.findByPk(eventId);
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    await event.set({
        venueId, name, type, capacity, price, description, startDate, endDate
    }).save();

    // Changing the date format of both startDate and endDate
    // from "(year-month-day)T(hour:minute:second).000Z"
    // to "(year-month-day) (hour:minute:second)"
    let { startDate: eventStartDate, endDate: eventEndDate } = event.dataValues;
    const changedDateFormats = [eventStartDate, eventEndDate].map(date => {
        date = date.toISOString().split('T');
        date[1] = date[1].split('.')[0];
        date = date.join(' ');
        return date;
    })
    event.dataValues.startDate = changedDateFormats[0];
    event.dataValues.endDate = changedDateFormats[1];

    return res.status(200).json({
        id: event.id,
        venueId: event.venueId,
        groupId: event.groupId,
        name: event.name,
        description: event.description,
        type: event.type,
        capacity: event.capacity,
        price: event.price,
        startDate: event.startDate,
        endDate: event.endDate
    });
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
        ],
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
        }
    });

    // For counting number of attendance in the event
    const numAttending = await event.countAttendee();
    event.dataValues.numAttending = numAttending;

    // Changing the date format of both startDate and endDate
    // from "(year-month-day)T(hour:minute:second).000Z"
    // to "(year-month-day) (hour:minute:second)"
    let { startDate: eventStartDate, endDate: eventEndDate } = event.dataValues;
    const changedDateFormats = [eventStartDate, eventEndDate].map(date => {
        date = date.toISOString().split('T');
        date[1] = date[1].split('.')[0];
        date = date.join(' ');
        return date;
    })
    event.dataValues.startDate = changedDateFormats[0];
    event.dataValues.endDate = changedDateFormats[1];

    return res.status(200).json(event);
})

// Delete an event specified by its id
router.delete('/:eventId', restoreUser, requireAuth2, eventExists, hostOrCohostOfGroup, async (req, res) => {
    const eventId = +req.params.eventId;
    const event = await Event.findByPk(eventId);
    event.destroy();
    return res.status(200).json({
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
            // {
            //     model: User,
            //     as: "Attendee"
            // }
        ],
        attributes: [
            'id',
            'groupId',
            'venueId',
            'name',
            'type',
            'startDate',
            'endDate',
        ]
    };

    // Getting the query
    let { page, size, name, type, startDate } = req.query;

    // Setting the page and size
    if (page > 10) page = 1;
    if (size > 20) size = 20;
    if (isNaN(page) || page < 1 || isNaN(size) || size < 1) return queryBadRequest(res);
    // Applying the page and size
    eventCriteria.limit = size;
    eventCriteria.offset = size * (page - 1);

    // If there exist any name, type, or startDate,
        // then filter events matching these attributes.
    eventCriteria.where = {};
    if (name) eventCriteria.where.name = name;
    if (type) {
        if (type.toLowerCase() === "in person") {
            eventCriteria.where.type = { [Op.in]: ["In person", "In Person"] };
        }
        else if (type.toLowerCase() === "online") {
            eventCriteria.where.type = "Online"
        }
    }
    if (startDate) eventCriteria.where.startDate = {
        [Op.and]: {
            [Op.gte]: new Date(startDate + " 00:00:00"),
            [Op.lte]: new Date(startDate + " 23:59:59.999")
        }
    }

    // Finding and paginating all events
    let events = await Event.findAll(eventCriteria);

    // Aggregate using JavaScript instead
    for (const event of events) {
        // For counting number of attendance in each event
        const numAttending = await event.countAttendee();
        event.dataValues.numAttending = numAttending;

        // And extracting each event's preview image
        const eventId = event.dataValues.id;
        const previewImage = await EventImage.findOne({
            where: { 
                eventId,
                preview: true,
            }
        });
        if (previewImage) {
            event.dataValues.previewImage = previewImage.dataValues.url;
        }
        else {
            event.dataValues.previewImage = null;
        }

        // Changing the date format of both startDate and endDate
        // from "(year-month-day)T(hour:minute:second).000Z"
        // to "(year-month-day) (hour:minute:second)"
        let { startDate: eventStartDate, endDate: eventEndDate } = event.dataValues;
        const changedDateFormats = [eventStartDate, eventEndDate].map(date => {
            date = date.toISOString().split('T');
            date[1] = date[1].split('.')[0];
            date = date.join(' ');
            return date;
        })
        event.dataValues.startDate = changedDateFormats[0];
        event.dataValues.endDate = changedDateFormats[1];
    }

    return res.status(200).json({Events: events});
})

module.exports = router;