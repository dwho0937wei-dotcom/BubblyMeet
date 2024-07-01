const express = require('express');
const jwt = require('jsonwebtoken');

const { Group, Member, Image, User, Venue, Event } = require('../../db/models');

const router = express.Router();

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