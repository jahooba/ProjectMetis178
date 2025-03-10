const express = require('express');
const cors = require('cors');
const PreprocessedCourse = require('../model/processedCourseModel');
const router = express.Router();
const {getCourseTree, getAllCourses } = require('../controllers/courseController');

router.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173'
  })
)

// router.get('/courses', async (req, res) => {
//     const courseName = req.query.name;
//     if (!courseName) {
//       return res.status(400).json({ message: "Course name is required" });
//     }

//     try {
//       const course = await PreprocessedCourse.findOne({ name: courseName });
//       if (!course) {
//         return res.status(404).json({ message: "Course not found", course: courseName });
//       }
//       res.status(200).json(course);
//     } catch (error) {
//       res.status(500).json({ message: "Error retrieving course", error: error.message });
//     }
// });

router.get('/courses', getCourseTree);
router.get('/courses/all', getAllCourses);

module.exports = router;
