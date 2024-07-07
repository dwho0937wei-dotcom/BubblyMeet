const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User, Group, Membership, GroupImage, Sequelize, Venue, Event, Attendance, EventImage} = require('../../db/models');
const { userLoggedIn, requireAuth2, requireProperAuth } = require('../../utils/auth');

const router = express.Router();

// Delete an image for a group


module.exports = router;