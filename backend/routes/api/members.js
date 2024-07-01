const express = require('express');
const jwt = require('jsonwebtoken');

const { Group, Member, Image, User, Venue } = require('../../db/models');

const router = express.Router();

// Request a new membership


// Get all members of a group specified by its id
router.get('/groupId/:groupId', async (req, res) => {
    const groupId = +req.params.groupId;
    const group = await Group.findByPk(groupId, {
        include: {
            model: User,
            attributes: ['id', 'firstName', 'lastName'],
            through: {
                model: Member,
                attributes: ['status']
            }
        }
    });
    if (!group) {
        res.status(404);
        return res.json({
            message: "Group couldn't be found"
        });
    }

    const groupJson = group.toJSON();
    let members = groupJson.Users;
    members = members.map(member => {
        member.Membership = member.Member;
        delete member.Member;
        return member;
    })
    // console.log(members);

    return res.json({Members: members});
})

module.exports = router;