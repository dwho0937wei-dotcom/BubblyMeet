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

// Delete an image for a group
router.delete('/:imageId', async (req, res) => {
    if (!userLoggedIn(req)) {
        return requireAuth2(res);
    }
    const loginUser = getUserFromToken(req);

    const imageId = req.params.imageId;
    const image = await GroupImage.findByPk(imageId);
    if (!image) {
        res.status(404);
        return res.json({
            message: "Group Image couldn't be found"
        })
    }

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