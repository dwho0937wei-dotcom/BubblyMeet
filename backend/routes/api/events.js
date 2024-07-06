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