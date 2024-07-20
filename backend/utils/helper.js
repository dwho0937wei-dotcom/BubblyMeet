// backend/utils/helper.js
const jwt = require('jsonwebtoken');

const { User, Group, Membership, GroupImage, Sequelize, Venue, Event, Attendance, EventImage } = require('../../backend/db/models');

// Getting Current User From Token
const getUserFromToken = function (req) {
    const { token } = req.cookies;
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = decodeToken.data;
    return user;
} 

// Validate if group exist
const groupExists = async function (req, res, next) {
    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);
    if (!group) {
        res.status(404);
        return res.json({
            message: "Group couldn't be found"
        })
    }

    return next();
}

// Validate if venue exist
const venueExists = async function (req, res, next) {
    let venueId;
    if (req.params.venueId) {
        venueId = req.params.venueId;
    }
    else if (req.body.venueId) {
        venueId = req.body.venueId;
    }

    const venue = await Venue.findByPk(venueId);
    if (!venue) {
        res.status(404);
        return res.json({
            message: "Venue couldn't be found"
        })
    }

    return next();
}

// Validate if event exist
const eventExists = async function (req, res, next) {
    const eventId = req.params.eventId;
    const event = await Event.findByPk(eventId);
    if (!event) {
        res.status(404);
        return res.json({
            message: "Event couldn't be found"
        })
    }

    return next();
}

// Validate if event-image exist
const eventImageExists = async function (req, res, next) {
    const eventImageId = req.params.imageId;
    const eventImage = await EventImage.findByPk(eventImageId);
    if (!eventImage) {
        res.status(404);
        return res.json({
            message: "Event Image couldn't be found"
        })
    }

    return next();
}

// Validate if group-image exist
const groupImageExists = async function (req, res, next) {
    const groupImageId = req.params.imageId;
    const groupImage = await GroupImage.findByPk(groupImageId);
    if (!groupImage) {
        res.status(404);
        return res.json({
            message: "Group Image couldn't be found"
        })
    }

    return next();
}

module.exports = {
    getUserFromToken,
    groupExists,
    venueExists,
    eventExists,
    eventImageExists,
    groupImageExists
}