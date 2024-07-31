const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User, Group, Membership, GroupImage, Sequelize, Venue, Event, Attendance, EventImage} = require('../../db/models');
const { userLoggedIn, restoreUser, requireAuth2, requireProperAuth, hostOrCohostOfGroup } = require('../../utils/auth');
const { getUserFromToken, eventImageExists } = require('../../utils/helper');

const router = express.Router();

// Delete an image for an event
router.delete('/:imageId', restoreUser, requireAuth2, eventImageExists, hostOrCohostOfGroup, async (req, res) => {
    const imageId = req.params.imageId;
    const image = await EventImage.findByPk(imageId);
    image.destroy();
    return res.status(200).json({
        message: "Successfully deleted"
    });
})

module.exports = router;