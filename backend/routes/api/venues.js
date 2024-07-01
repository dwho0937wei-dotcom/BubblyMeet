const express = require('express');
const jwt = require('jsonwebtoken');

const { Op } = require('sequelize');
const { Venue, Group, User, Member } = require('../../db/models');

const router = express.Router();

const groupNotFound = {
    message: "Group couldn't be found"
};

// Get all venues for a group specified by its id
router.get('/:groupId', async (req, res) => {
    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);
    if (!group) {
        res.status(404);
        return res.json(groupNotFound);
    }

    const venues = await Venue.findAll({
        where: { groupId },
        attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
    });
    res.status(200);
    return res.json({
        Venues: venues
    });
})

// Create a new venue for a group specified by its id
router.post('/:groupId', async (req, res) => {
    const { address, city, state, lat, lng } = req.body;
    const { token } = req.cookies;
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodeToken.data.id;

    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId, {
        include: {
            model: User,
            through: {
                model: Member,
                where: { 
                    status: { [Op.or]: ['organizer', 'co-host'] }, 
                    userId 
                }   
            }
        }
    });
    if (!group) {
        res.status(404);
        return res.json(groupNotFound);
    }
    // console.log(group);

    const groupJson = group.toJSON();
    if (groupJson.Users.length > 0) {
        const newVenue = await Venue.create({
            address,
            city,
            state,
            lat,
            lng,
            groupId
        });
        res.status(201);

        const payload = newVenue.toJSON();
        delete payload.createdAt;
        delete payload.updatedAt;
        return res.json(payload);
    }

    res.status(401);
    return res.json({
        message: 'Invalid Authentication'
    });
})

module.exports = router;