const express = require('express');
const router = express.Router();
const { updateCompletedCourses, getCompletedCourses } = require('../controllers/userController');
const cors = require('cors');

router.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}));

// POST endpoint to update a user's completed courses
router.post('/users/updateCompleted', updateCompletedCourses);
router.get('/users/getCompleted', getCompletedCourses);

module.exports = router;