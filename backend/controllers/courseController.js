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
        const PC_course = await PreprocessedCourse.findOne({ name: courseName });

        if (!PC_course) {
            return res.status(404).json({ message: "Course not found", query: courseName });
        }

        const allCourseNames = new Set();  // Store unique course names from the tree

        const traverseTree = (node) => {
            allCourseNames.add(node.name);
            if (node.children) {
                node.children.forEach(traverseTree);
            }
        };
        traverseTree(PC_course);

        console.log("All course names to match in courses:", [...allCourseNames]);
        // Change name
        const RG_prereqData = await Course.find(
            { courseID: { $in: Array.from(allCourseNames).map(name => new RegExp(`^${name}$`, "i")) } }, 
            "courseID PREREQS title units description"
        );        
        
        // Step 3: Return both datasets
        res.status(200).json({
            PC_course,
            RG_prereqData
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Error retrieving course data", 
            query: req.query.name || "unknown", 
            error: error.message 
        });
    }
};

// const getAllCourses = async(req,res) => {
//     try {
//         const courses = await Course.find({});
//         res.status(200).json(courses);
//     } 
//     catch (error) {
//         res.status(500).json({ message: "Error fetching courses", error: error.message });
//     }
// };

module.exports = { getCourseTree };