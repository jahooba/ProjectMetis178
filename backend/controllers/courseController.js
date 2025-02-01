const Course = require('../model/courseModel');
const PreprocessedCourse = require('../model/processedCourseModel');

const getCourseTree = async(req, res) => {
    try {
        const courseName = req.query.name?.trim();

        if (!courseName) {
            return res.status(400).json({ message: "Course name is required" });
        }

        console.log("Searching for course:", courseName);

        // Case-insensitive search with regex
        const course = await PreprocessedCourse.findOne({ name: courseName });

        if (!course) {
            return res.status(404).json({ message: "Course not found", query: courseName });
        }

        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving course data", query: courseName, error: error.message });
    }
};

const getAllCourses = async(req,res) => {
    try {
        const courses = await Course.find({});
        res.status(200).json(courses);
    } 
    catch (error) {
        res.status(500).json({ message: "Error fetching courses", error: error.message });
    }
};

module.exports = { getCourseTree, getAllCourses };