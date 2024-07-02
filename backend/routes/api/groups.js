const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User, Group, Membership, GroupImage, Sequelize, Venue } = require('../../db/models');
const { userLoggedIn, requireAuth2 } = require('../../utils/auth');

const router = express.Router();

const getUserFromToken = function (req) {
    const { token } = req.cookies;
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = decodeToken.data;
    return user;
} 

// Get details from a group specified by its id
router.get('/:groupId', async (req, res) => {
    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId, {
        include: [
            {
                model: GroupImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: Venue,
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            }
        ]
    })
    if (!group) {
        res.status(404);
        res.json({
            message: "Group couldn't be found"
        })
    }

    let organizer = await User.findByPk(group.organizerId, {
        attributes: ['id', 'firstName', 'lastName']
    });
    organizer = organizer.toJSON();
    group.dataValues.Organizer = organizer;
    res.status(200);
    res.json(group);
})

// Get all groups joined or organized by the current user
router.get('/current', async (req, res) => {
    if (!userLoggedIn(req)) {
        return requireAuth2(res);
    }
    const user = getUserFromToken(req);

    const groups = await Group.findAll({
        include: [
            {
                model: GroupImage,
                where: { preview: true },
                attributes: []
            },
            {
                model: Membership,
                attributes: []
            }
        ],
        attributes: {
            include: [[Sequelize.fn("COUNT", Sequelize.col("Memberships.id")), "numMembers"], 
                      [Sequelize.fn("", Sequelize.col("GroupImages.url")), "previewImage"]]
        },
        where: { 
            [Op.or]: [
               { organizerId: user.id },
               Sequelize.literal(`EXISTS (SELECT 1 FROM Memberships WHERE Memberships.groupId = id AND Memberships.userId = ${user.id})`)
            ]
        }
    });
    res.json(groups);
})

// Get all groups
router.get('/', async (req, res) => {
    const groups = await Group.findAll({
        include: [
            {
                model: GroupImage,
                where: { preview: true },
                attributes: []
            },
            {
                model: Membership,
                attributes: []
            }
        ],
        attributes: {
            include: [[Sequelize.fn("COUNT", Sequelize.col("Memberships.id")), "numMembers"], 
                      [Sequelize.fn("", Sequelize.col("GroupImages.url")), "previewImage"]]
        }
    });
    res.json(groups);
})

module.exports = router;