const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User, Group, Membership, GroupImage, Sequelize, Venue } = require('../../db/models');
const { userLoggedIn, requireAuth2, requireProperAuth } = require('../../utils/auth');
const { getUserFromToken } = require('../../utils/helper');
const { validateVenue } = require('../../utils/validation');

const router = express.Router();

// Edit a venue specified by its id
router.put('/:venueId', validateVenue, async (req, res) => {
    if (!userLoggedIn(req)) {
        return requireAuth2(res);
    }
    const user = getUserFromToken(req);

    const venueId = req.params.venueId;
    const venue = await Venue.findByPk(venueId);
    if (!venue) {
        res.status(404);
        return res.json({
            message: "Venue couldn't be found"
        })
    }

    const groupId = venue.dataValues.groupId;
    const group = await Group.findByPk(groupId);
    const coHost = await Membership.findOne({
        where: {userId: user.id, groupId, status: 'co-host'}
    });
    if (group.dataValues.organizerId !== user.id && !coHost) {
        return requireProperAuth(res);
    }

    const { address, city, state, lat, lng } = req.body;
    await venue.set({
        address, city, state, lat, lng
    });
    await venue.save();
    res.status(200);
    res.json(venue);
})

module.exports = router;