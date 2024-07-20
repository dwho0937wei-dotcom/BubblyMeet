const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User, Group, Membership, GroupImage, Sequelize, Venue, Event, Attendance, EventImage} = require('../../db/models');
const { userLoggedIn, restoreUser, requireAuth2, requireProperAuth } = require('../../utils/auth');
const { getUserFromToken, groupImageExists } = require('../../utils/helper');

const router = express.Router();

// Delete an image for a group
router.delete('/:imageId', restoreUser, requireAuth2, groupImageExists, async (req, res) => {
    const loginUser = getUserFromToken(req);

    const imageId = req.params.imageId;
    const image = await GroupImage.findByPk(imageId);

    const groupId = image.dataValues.groupId;
    const group = await Group.findByPk(groupId);
    const coHost = await Membership.findOne({
        where: {userId: loginUser.id, groupId, status: 'co-host'}
    });
    if (group.dataValues.organizerId !== loginUser.id && !coHost) {
        return requireProperAuth(res);
    }

    res.status(200);
    await image.destroy();
    return res.json({
        message: "Successfully deleted"
    })
})

module.exports = router;