const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User, Group, Membership, GroupImage, Sequelize, Venue, Event, Attendance, EventImage } = require('../../db/models');
const { userLoggedIn, requireAuth2, requireProperAuth } = require('../../utils/auth');
const { getUserFromToken } = require('../../utils/helper');
const { validateGroup, validateVenue, validateEvent } = require('../../utils/validation');

const router = express.Router();

// Delete a membership to a group specified by id
router.delete('/:groupId/membership/:memberId', async (req, res) => {
    if (!userLoggedIn(req)) {
        return requireAuth2(res);
    }
    const user = getUserFromToken(req);

    const groupId = +req.params.groupId;
    const group = await Group.findByPk(groupId);
    if (!group) {
        res.status(404);
        return res.json({
            message: "Group couldn't be found"
        })
    }

    const memberId = +req.params.memberId;
    const memberUser = await User.findByPk(memberId);
    if (!memberUser) {
        res.status(404);
        return res.json({
            message: "User couldn't be found"
        });
    }
    const membershipToDelete = await Membership.findOne(
        { where: { userId: memberId } }
    );
    if (!membershipToDelete) {
        res.status(404);
        return res.json({
            message: "Membership does not exist for this User"
        });
    }

    if (group.organizerId !== user.id && memberId !== user.id) {
        return requireProperAuth(res);
    }

    res.status(200);
    await membershipToDelete.destroy();
    res.json({
        message: "Successfully deleted membership from group"
    });
})

// Create a new venue for a group specified by its id
router.post('/:groupId/venues', validateVenue, async (req, res) => {
    if (!userLoggedIn(req)) {
        return requireAuth2(res);
    }
    const user = getUserFromToken(req);

    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);
    if (!group) {
        res.status(404);
        return res.json({
            message: "Group couldn't be found"
        })
    }

    const coHost = await Membership.findOne({
        where: {userId: user.id, groupId, status: 'co-host'}
    });
    if (group.dataValues.organizerId !== user.id && !coHost) {
        return requireProperAuth(res);
    }

    const { address, city, state, lat, lng } = req.body;
    let newVenue = await group.createVenue({
        address, city, state, lat, lng
    });
    newVenue = newVenue.toJSON();
    delete newVenue.updatedAt;
    delete newVenue.createdAt;
    res.status(200);
    res.json(newVenue);
})

// Get all venues for a group specified by its id
router.get('/:groupId/venues', async (req, res) => {
    if (!userLoggedIn(req)) {
        return requireAuth2(res);
    }
    const user = getUserFromToken(req);

    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);
    if (!group) {
        res.status(404);
        return res.json({
            message: "Group couldn't be found"
        })
    }

    const coHost = await Membership.findOne({
        where: {userId: user.id, groupId, status: 'co-host'}
    });
    if (group.dataValues.organizerId !== user.id && !coHost) {
        return requireProperAuth(res);
    }

    const venues = await group.getVenues();
    res.status(200);
    res.json({Venues: venues})
})

// Change the status of a membership for a group specified by its id
router.put('/:groupId/membership', async (req, res) => {
    if (!userLoggedIn(req)) {
        return requireAuth2(res);
    }
    const user = getUserFromToken(req);

    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);
    if (!group) {
        res.status(404);
        return res.json({
            message: "Group couldn't be found"
        })
    }

    const { memberId, status } = req.body;
    const memberUser = await User.findByPk(memberId);
    if (!memberUser) {
        res.status(404);
        return res.json({
            message: "User couldn't be found"
        });
    }

    const membershipToUpdate = await Membership.findOne(
        { where: { userId: memberId } }
    );
    if (!membershipToUpdate) {
        res.status(404);
        return res.json({
            message: "Membership between the user and the group does not exist"
        });
    }

    if (status === 'pending') {
        res.status(400);
        return res.json({
            message: "Bad Request",
            errors: {
                status: "Cannot change a membership to pending"
            }
        })
    }
    else if (status === 'member') {
        const coHost = await Membership.findOne({
            where: {userId: user.id, groupId, status: 'co-host'}
        });
        if (group.dataValues.organizerId !== user.id && !coHost) {
            return requireProperAuth(res);
        }
    }
    else if (status === 'co-host') {
        if (group.dataValues.organizerId !== user.id) {
            return requireProperAuth(res);
        }
    }

    if (status === 'member' || status === 'co-host') {
        membershipToUpdate.set({
            status
        });
        await membershipToUpdate.save();
    }
    res.status(200);
    const payload = {
        id: membershipToUpdate.dataValues.id,
        userId: membershipToUpdate.dataValues.userId,
        groupId: membershipToUpdate.dataValues.groupId,
        status: membershipToUpdate.dataValues.status
    };
    return res.json(payload);
})

// Request a membership for a group specified by its id
router.post('/:groupId/membership', async (req, res) => {
    if (!userLoggedIn(req)) {
        return requireAuth2(res);
    }
    const user = getUserFromToken(req);

    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);
    if (!group) {
        res.status(404);
        return res.json({
            message: "Group couldn't be found"
        })
    }

    const sameMember = await Membership.findOne({
        where: {
            userId: user.id,
            groupId
        }
    });
    if (sameMember) {
        res.status(400);
        const status = sameMember.dataValues.status;
        if (status === 'pending') {
            return res.json({
                message: "Membership has already been requested"
            })
        }
        else {
            return res.json({
                message: "User is already a member of the group"
            })
        }
    }

    res.status(200);
    const newMember = await group.addUser(user.id, { through: { status:'pending' } });
    const payload = {
        memberId: newMember[0].dataValues.userId,
        status: newMember[0].dataValues.status
    };
    return res.json(payload);
})

// Get all members of a group specified by its id
router.get('/:groupId/members', async (req, res) => {
    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);
    if (!group) {
        res.status(404);
        res.json({
            message: "Group couldn't be found"
        })
    }

    let user;
    let isOrganizer = false;
    if (userLoggedIn(req)) {
        user = getUserFromToken(req);
        if (user.id === group.dataValues.organizerId) {
            isOrganizer = true;
        }
    }

    let memberCriteria = {
        attributes: ['id', 'firstName', 'lastName'],
        joinTableAttributes: ['status']
    };
    if (!isOrganizer) {
        memberCriteria.where = 
        {
            '$Membership.status$': {
                [Op.notIn]: ['pending']
            }
        }
    }
    const members = await group.getUsers(memberCriteria);

    res.status(200);
    res.json({ Members: members });
})

// Add an image to a group specified by its id
router.post('/:groupId/images', async (req, res) => {
    if (!userLoggedIn(req)) {
        return requireAuth2(res);
    }
    const user = getUserFromToken(req);

    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);
    if (!group) {
        res.status(404);
        return res.json({
            message: "Group couldn't be found"
        })
    }
    if (group.dataValues.organizerId !== user.id) {
        return requireProperAuth(res);
    }

    const { url, preview } = req.body;
    let newImage = await group.createGroupImage({ url, preview });
    newImage = newImage.toJSON();
    delete newImage.groupId;
    delete newImage.updatedAt;
    delete newImage.createdAt;
    res.status(200);
    res.json(newImage);
})

// Create an event for a group specified by its id
router.post('/:groupId/events', validateEvent, async (req, res) => {
    if (!userLoggedIn(req)) {
        return requireAuth2(res);
    }
    const user = getUserFromToken(req);

    const groupId = +req.params.groupId;
    const group = await Group.findByPk(groupId);
    if (!group) {
        res.status(404);
        return res.json({
            message: "Group couldn't be found"
        })
    }

    const coHost = await Membership.findOne({
        where: {userId: user.id, groupId, status: 'co-host'}
    });
    if (group.dataValues.organizerId !== user.id && !coHost) {
        return requireProperAuth(res);
    }

    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    const venue = await Venue.findByPk(venueId);
    if (!venue) {
        res.status(404);
        return res.json({
            message: "Venue couldn't be found"
        })
    }

    const newEvent = await Event.create({
        venueId, groupId, name, type, capacity, price, description, startDate, endDate
    });
    const newEventJson = newEvent.toJSON();
    delete newEventJson.createdAt;
    delete newEventJson.updatedAt;
    res.status(200);
    res.json(newEventJson);
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
                model: User,
                as: 'Members',
                attributes: []
            },
            {
                model: GroupImage,
                required: false,
                where: { preview: true },
                attributes: []
            }
        ],
        attributes: {
            include: [[Sequelize.literal('(SELECT COUNT(*) FROM Memberships WHERE Memberships.groupId =`Group`.`id`)'), 'numMembers'], 
                      [Sequelize.literal(`(COALESCE(GroupImages.url, ''))`), 'previewImage']]
        },
        where: { 
            [Op.or]: [
               { organizerId: user.id },
               Sequelize.literal(`EXISTS (SELECT 1 FROM Memberships WHERE Memberships.groupId = 'Group'.'id' AND Memberships.userId = ${user.id})`)
            ]
        },
        group: ['Group.id', 'Members.id', 'GroupImages.id']
    });
    return res.json({Groups: groups});
})

// Get all events of a group specified by its id
router.get('/:groupId/events', async (req, res) => {
    const groupId = req.params.groupId;

    const events = await Event.findAll({
        where: { groupId },
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

// Edit a group
router.put('/:groupId', validateGroup, async (req, res) => {
    if (!userLoggedIn(req)) {
        return requireAuth2(res);
    }
    const user = await getUserFromToken(req);

    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);
    if (!group) {
        res.status(404);
        return res.json({
            message: "Group couldn't be found"
        })
    }
    if (group.dataValues.organizerId !== user.id) {
        return requireProperAuth(res);
    }

    const { name, about, type, private, city, state } = req.body;
    await group.set({
        name, about, type, private, city, state
    });
    await group.save();
    res.status(200);
    res.json(group);
})

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

// Delete the group specified by its id
router.delete('/:groupId', async (req, res) => {
    if (!userLoggedIn(req)) {
        return requireAuth2(res);
    }

    const user = await getUserFromToken(req);

    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);
    if (!group) {
        res.status(404);
        return res.json({
            message: "Group couldn't be found"
        })
    }
    if (group.dataValues.organizerId !== user.id) {
        return requireProperAuth(res);
    }

    await group.destroy();
    res.status(200);
    res.json({
        message: "Successfully deleted"
    });
})

// Create a group
router.post('/', validateGroup, async (req, res) => {
    if (!userLoggedIn(req)) {
        return requireAuth2(res);
    }
    const user = getUserFromToken(req);
    const { name, about, type, private, city, state } = req.body;
    const newGroup = await Group.create({
        name, about, type, private, city, state,
        organizerId: user.id
    });
    res.status(201);
    res.json(newGroup);
})

// Get all groups
router.get('/', async (req, res) => {
    const groups = await Group.findAll(
        {
            include: [
                {
                    model: Membership,
                    attributes: []
                },
                {
                    model: GroupImage,
                    required: false,
                    where: { preview: true },
                    attributes: []
                }
            ],
            attributes: {
                include: [[Sequelize.fn("COUNT", Sequelize.col("Memberships.id")), "numMembers"], 
                [Sequelize.literal(`COALESCE(GroupImages.url, '')`), 'previewImage']]
            },
            group: ['Group.id', 'GroupImages.id', 'Memberships.id']
        }
    );
    res.json({Groups: groups});
})

module.exports = router;