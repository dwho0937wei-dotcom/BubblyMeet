// backend/utils/validation.js
const { validationResult } = require('express-validator');
const { check } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad request");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request";
    delete err.stack;
    next(err);
  }
  next();
};

// Validate User
const validateLogin = [
  check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Email or username is required'),
  check('password')
      .exists({ checkFalsy: true })
      .withMessage('Password is required'),
  handleValidationErrors
];

const validateSignUp = [
  check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Invalid email'),
  check('username')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Username is required'),
  check('firstName')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('First Name is required'),
  check('lastName')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Last Name is required'),
  handleValidationErrors
];

// Validate Group
const validateGroup = [
  check('name')
      .exists({ checkFalsy: true })
      .isLength({ max: 60 })
      .withMessage('Name must be 60 characters or less'),
  check('about')
      .exists({ checkFalsy: true })
      .isLength({ min: 50 })
      .withMessage('About must be 50 characters or more'),
  check('type')
      .exists({ checkFalsy: true })
      .isIn(['Online', 'In person'])
      .withMessage("Type must be 'Online' or 'In person'"),
  check('private')
      .exists({ checkNull: true })
      .isBoolean()
      .withMessage('Private must be a boolean'),
  check('city')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('City is required'),
  check('state')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('State is required'),
  handleValidationErrors
];

// Validate Venue
const validateVenue = [
  check('address')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Street address is required'),
  check('city')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('City is required'),
  check('state')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('State is required'),
  check('lat')
      .exists({ checkFalsy: true })
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be within -90 and 90'),
  check('lng')
      .exists({ checkFalsy: true })
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude must be within -180 and 180'),
  handleValidationErrors
];

// Validate Event
const today = new Date().toISOString();
const validateEvent = [
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ min: 5 })
        .withMessage('Name must be at least 5 characters'),
    check('type')
        .exists({ checkFalsy: true })
        .isIn(['Online', 'In person'])
        .withMessage("Type must be Online or In person"),
    check('capacity')
        .exists({ checkFalsy: true })
        .isInt()
        .withMessage('Capacity must be an integer'),
    check('price')
        .exists({ checkFalsy: true })
        .isFloat({ min: 0 })
        // .isDecimal({ decimal_digits: 2 })
        .custom(price => {
            const places = price.toString().split('.');
            if (places.length > 1 && places[1].length > 2) {
                throw new Error();
            }
            return true;
        })
        .withMessage('Price is invalid'),
    check('description')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Description is required'),
    check('startDate')
        .exists({ checkFalsy: true })
        .isAfter(today)
        .withMessage('Start date must be in the future'),
    check('endDate')
        .exists({ checkFalsy: true })
        .custom((_endDate, { req }) => {
            const startDate = req.body.startDate;
            if (!check('endDate').isAfter(startDate)) {
                throw new Error();
            }
            return true;
        })
        .withMessage('End date is less than start date'),
    handleValidationErrors
];

// Validate Attendance
const validateAttendance = [
    check('status')
        .exists({ checkFalsy: true })
        .not().isIn(['pending'])
        .withMessage('Cannot change an attendance status to pending'),
    handleValidationErrors
];

module.exports = {
  validateLogin,
  validateSignUp,
  validateGroup,
  validateVenue,
  validateEvent,
  validateAttendance
};