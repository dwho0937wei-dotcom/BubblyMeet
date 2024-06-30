// backend/routes/api/index.js
const router = require('express').Router();
const usersRouter = require('./users.js');
const { restoreUser } = require("../../utils/auth.js");

router.use('/users', usersRouter);

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;