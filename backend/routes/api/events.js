const express = require('express');
const jwt = require('jsonwebtoken');

const { Op } = require('sequelize');
const { Group, Member, Image, User, Venue, Event } = require('../../db/models');

const router = express.Router();

const requireAuth = async (res) => {
    res.status(401);
    return res.json({
        message: 'Authentication required'
    })
}

const properAuth = async (res) => {
    res.status(403);
    return res.json({
        message: 'Forbidden'
    })
}

const invalidEvent = {
    "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
    "errors": {
        "venueId": "Venue does not exist",
        "name": "Name must be at least 5 characters",
        "type": "Type must be Online or In person",
        "capacity": "Capacity must be an integer",
        "price": "Price is invalid",
        "description": "Description is required",
        "startDate": "Start date must be in the future",
        "endDate": "End date is less than start date",
    }
}

// Create an event of a group specified by its id
router.post('/groupId/:groupId', async (req, res) => {
    const { token } = req.cookies;
    try {
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return requireAuth(res);
    }
    const userId = decodeToken.data.id;

    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId, {
        include: {
            model: User,
            through: {
                model: Member,
                where: { status: { [Op.or]: ['organizer', 'co-host'] } }
            }
        }
    });
    if (!group) {
        res.status(404);
        res.json( {
            message: "Group couldn't be found"
        })
    }
    const groupJson = group.toJSON();
    // console.log(groupJson);

    let hasAuthorization = false;
    groupJson.Users.forEach(user => {
        if (user.id === userId) {
            hasAuthorization = true;
        }
    });
    if (!hasAuthorization) {
        return properAuth(res);
    }

    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    try {
        const venue = await Venue.findByPk(venueId);
        // console.log('Venue:', venue);
        if (!venue) {
            throw new Error('Venue does not exist!');
        }
        const newEvent = await Event.create({
            venueId, name, type, capacity, price, description, startDate, endDate, groupId
        });
        const eventJson = newEvent.toJSON();
        delete eventJson.createdAt;
        delete eventJson.updatedAt;
        delete eventJson.numAttending;
        res.status(201);
        res.json(eventJson);
    } 
    catch (error) {
        // console.log(error);
        res.status(400);
        res.json(invalidEvent);
    }
})

// Get all events of a group specified by its id
router.get('/groupId/:groupId', async (req, res) => {
    const groupId = req.params.groupId;
    const group = Group.findByPk(groupId);
    if (!group) {
        res.status(404);
        res.json({
            message: "Group couldn't be found"
        })
    }

    const events = await Event.findAll({
        where: { groupId },
        attributes: { exclude: ['eventId', 'createdAt', 'updatedAt'] },
        include: [
            {
                model: Group,
                attributes: ['id', 'name', 'city', 'state']
            },
            {
                model: Venue,
                attributes: ['id', 'city', 'state']
            }
        ]
    });

    res.status(200);
    res.json({Events: events});
})

// Get details of the event specified by its id
router.get('/details/:eventId', async (req, res) => {
    const eventId = req.params.eventId;
    const event = await Event.findByPk(eventId, {
        attributes: { exclude: ['eventId', 'createdAt', 'updatedAt'] },
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
                model: Image,
                attributes: ['id', 'url', 'preview']
            }
        ]
    });
    if (!event) {
        res.status(404);
        return res.json({
            message: "Event couldn't be found"
        });
    }

    const eventJson = event.toJSON();
    eventJson.EventImages = eventJson.Images;
    delete eventJson.Images;
    res.status(200);
    res.json(eventJson);
})

// Get all events
router.get('/', async (req, res) => {
    const events = await Event.findAll({
        attributes: { exclude: ['eventId', 'createdAt', 'updatedAt'] },
        include: [
            {
                model: Group,
                attributes: ['id', 'name', 'city', 'state']
            },
            {
                model: Venue,
                attributes: ['id', 'city', 'state']
            }
        ]
    });

    res.status(200);
    res.json({Events: events});
})

module.exports = router;