// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Group, Venue, Event, EventImage, Membership, Attendance } = require('../db/models');
const { getUserFromToken } = require('./helper');
const { Op } = require('sequelize');

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    // Create the token.
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };
    const token = jwt.sign(
      { data: safeUser },
      secret,
      { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );
  
    const isProduction = process.env.NODE_ENV === "production";
  
    // Set the token cookie
    res.cookie('token', token, {
      maxAge: expiresIn * 1000, // maxAge in milliseconds
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction && "Lax"
    });
  
    return token;
};

// Get user from the cookie token
const restoreUser = (req, res, next) => {
  // token parsed from cookies
  const { token } = req.cookies;
  req.user = null;

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.findByPk(id, {
        attributes: {
          include: ['email', 'createdAt', 'updatedAt']
        }
      });
    } catch (e) {
      res.clearCookie('token');
      return next();
    }

    if (!req.user) res.clearCookie('token');

    return next();
  });
};

// --------------------------------------------------------------- Authentications --------------------------------------------------------------------

// Custom error display for authentication
class AuthenticationError extends Error {
  constructor() {
    super();
    this.status = 401;
    this.title = 'Client Error'
    this.message = 'Authentication required';
    delete this.stack;
  }

  toJSON() {
    return {
      message: this.message,
    };
  }
}

// If the user is logged in, return true
const userLoggedIn = function (req) {
  const { token } = req.cookies;
  let loggedIn = false;
  if (token) {
    loggedIn = jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (!err) {
        return true;
      }
    })
  }
  return loggedIn;
};

// If there is no current user, return an error
// Error Response: 1st Require Authentication
const requireAuth = function (req, res, next) {
  if (req.user) return next();

  const err = new AuthenticationError();
  // return next(err);
  return res.status(err.status).json({
    message: err.message
  });
}

// Error Response: 2nd Require Authentication
const requireAuth2 = function (req, res, next) {
  if (req.user) return next();

  const err = new AuthenticationError();
  // return next(err);
  return res.status(err.status).json({
    message: err.message
  });
};

// --------------------------------------------------------------- Authorizations --------------------------------------------------------------------

// Checks if user is the organizer of the group
const hostOfGroup = async function (req, res, next) {
  const user = getUserFromToken(req);
  const group = await Group.findByPk(req.params.groupId);
  if (group.dataValues.organizerId !== user.id) {
      return requireProperAuth(res);
  }
  return next();
}

// Checks if user is the organizer or co-host of the group
const hostOrCohostOfGroup = async (req, res, next) => {
  const user = getUserFromToken(req);

  let groupId;
  if (req.params.groupId) {
    groupId = +req.params.groupId;
  }
  else if (req.params.venueId) {
    const venue = await Venue.findByPk(+req.params.venueId);
    groupId = +venue.dataValues.groupId;
  }
  else if (req.params.eventId){
    const event = await Event.findByPk(+req.params.eventId);
    groupId = +event.dataValues.groupId
  }
  else if (req.params.imageId){
    const image = await EventImage.findByPk(+req.params.imageId);
    const event = await image.getEvent();
    groupId = +event.dataValues.groupId;
  }

  const hostOrCohost = await Membership.findOne({
      where: {
        userId: user.id, 
        groupId, 
        status: { [Op.in]: ['co-host', 'host'] }
      }
  });
  if (!hostOrCohost) {
      return requireProperAuth(res);
  }
  return next();
}

// Checks if user is an attendant, co-host, or host of an event
const partOfAnEvent = async (req, res, next) => {
  const user = getUserFromToken(req);
  const eventId = +req.params.eventId;
  const userAttendance = await Attendance.findOne({
      where: { userId: user.id, eventId, status: { [Op.in]: ["attending", "co-host", "host"] } }
  });
  if (!userAttendance) {
      return requireProperAuth(res);
  }
  return next();
}


const requireProperAuth = function (res) {
  return res.status(403).json({
    message: "Forbidden"
  });
};

// -------------------------------------------------------------------- Export -----------------------------------------------------------------------

module.exports = 
        { setTokenCookie, 
          restoreUser, 
          requireAuth, 
          userLoggedIn, 
          requireAuth2, 
          hostOfGroup,
          hostOrCohostOfGroup,
          partOfAnEvent,
          requireProperAuth };