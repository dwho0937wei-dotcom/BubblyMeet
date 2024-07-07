const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User, Group, Membership, GroupImage, Sequelize, Venue, Event, Attendance, EventImage} = require('../../db/models');
const { userLoggedIn, requireAuth2, requireProperAuth } = require('../../utils/auth');

const router = express.Router();

const getUserFromToken = function (req) {
    const { token } = req.cookies;
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = decodeToken.data;
    return user;
} 

async function listAssociationMethods(modelInstance) {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(modelInstance))
      .filter(method => typeof modelInstance[method] === 'function');
  
    console.log('Available methods:', methods);
}

// Delete attendance to an event specified by its id

// Add an Image to an Event based on its id
router.post('/:eventId/images', async (req, res) => {
    if (!userLoggedIn(req)) {
        return requireAuth2(res);
    }
    const user = getUserFromToken(req);

    const eventId = +req.params.eventId;
    const event = await Event.findByPk(eventId);
    if (!event) {
        res.status(404);
        res.json({
            message: "Event couldn't be found"
        });
    }

    const userAttendance = await Attendance.findOne({
        where: { userId: user.id, eventId }
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

// Get all attendees of an event specified by its id
router.get('/:eventId/attendees', async (req, res) => {
    const eventId = req.params.eventId;
    const event = await Event.findByPk(eventId);
    if (!event) {
        res.status(404);
        res.json({
            message: "Event couldn't be found"
        })
    }

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

    const attendants = await event.getAttendees(attendanceCriteria);
    return res.json({Attendees: attendants});
})

// Request to attend an event based on its id
router.post('/:eventId/attendance', async (req, res) => {
    if (!userLoggedIn(req)) {
        return requireAuth2(res);
    }
    const user = getUserFromToken(req);

    const eventId = req.params.eventId;
    const event = await Event.findByPk(eventId);
    if (!event) {
        res.status(404);
        res.json({
            message: "Event couldn't be found"
        })
    }

    const groupId = event.dataValues.groupId;
    const sameMember = await Membership.findOne({
        where: {userId: user.id, groupId}
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

// Edit an event specified by its id
router.put('/:eventId', async (req, res) => {
    if (!userLoggedIn(req)) {
        return requireAuth2(res);
    }
    const user = getUserFromToken(req);

    const eventId = req.params.eventId;
    const event = await Event.findByPk(eventId);
    if (!event) {
        res.status(404);
        res.json({
            message: "Event couldn't be found"
        })
    }
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
    if (!venue) {
        res.status(404);
        res.json({
            message: "Venue couldn't be found"
        })
    }

    try {
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
    } catch (error) {
        res.status(400);
        res.json(
          {
            "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
            "errors": {
              "name": "Name must be at least 5 characters",
              "type": "Type must be Online or In person",
              "capacity": "Capacity must be an integer",
              "price": "Price is invalid",
              "description": "Description is required",
              "startDate": "Start date must be in the future",
              "endDate": "End date is less than start date"
            }
          }
        )
    }
})

// Get details of an event specified by its id
router.get('/:eventId', async (req, res) => {
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
                model: Attendance,
                attributes: []
            }
        ],
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
            include: [[Sequelize.fn("COUNT", Sequelize.col("Attendances.id")), 'numAttending']]
        }
    });
    res.status(200);
    res.json(event);
})

// Delete an event specified by its id
router.delete('/:eventId', async (req, res) => {
    if (!userLoggedIn(req)) {
        return requireAuth2(res);
    }
    const user = getUserFromToken(req);

    const eventId = req.params.eventId;
    const event = await Event.findByPk(eventId);
    if (!event) {
        res.status(404);
        res.json({
            message: "Event couldn't be found"
        })
    }
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
    const events = await Event.findAll({
        include: [
            {
                model: Attendance,
                attributes: []
            },
            {
                model: Venue,
                attributes: ['id', 'city', 'state']
            },
            {
                model: EventImage,
                where: {preview: true},
                attributes: [],
            },
            {
                model: Group,
                attributes: ['id', 'name', 'city', 'state']
            }
        ],
        attributes: {
            include: [[Sequelize.fn("COUNT", Sequelize.col("Attendances.id")), "numAttending"],     
                      [Sequelize.fn("", Sequelize.col("EventImages.url")), "previewImage"]]
        },
        group: [
            'Event.id',
            'Venue.id',
            'Group.id',
            'EventImages.id',
            'Attendances.id'
        ]
    });
    res.status(200);
    res.json({Events: events});
})

module.exports = router;