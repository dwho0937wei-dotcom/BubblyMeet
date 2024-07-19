const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User, Group, Membership, GroupImage, Sequelize, Venue } = require('../../db/models');
const { userLoggedIn, restoreUser, requireAuth2, requireProperAuth } = require('../../utils/auth');
const { getUserFromToken, venueExists } = require('../../utils/helper');
const { validateVenue } = require('../../utils/validation');

const router = express.Router();

// Edit a venue specified by its id
router.put('/:venueId', restoreUser, requireAuth2, validateVenue, venueExists, async (req, res) => {
    const user = getUserFromToken(req);

    const venueId = req.params.venueId;
    const venue = await Venue.findByPk(venueId);

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