const User = require('../model/user');

const updateCompletedCourses = async (req, res) => {
  const { userId, course, action } = req.body;
  
  if (!userId || !course || !action) {
    return res.status(400).json({ error: "Missing userId, course, or action." });
  }

  try {
    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Update the completedCourses array based on the action
    if (action === 'add') {
      if (!user.completedCourses.includes(course)) {
        user.completedCourses.push(course);
      }
    } else if (action === 'remove') {
      user.completedCourses = user.completedCourses.filter(c => c !== course);
    } else {
      return res.status(400).json({ error: "Invalid action. Use 'add' or 'remove'." });
    }

    // Save the updated user document
    await user.save();
    return res.status(200).json({ 
      message: "Completed courses updated successfully.",
      completedCourses: user.completedCourses
    });
  } catch (error) {
    console.error("Error updating completed courses:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const getCompletedCourses = async (req, res) => {
  try {
      // Assuming you get the user ID from an authentication token or session
      const userId = req.query.userId?.trim();
      if (!userId) {
        return res.status(400).json({ error: "Missing userId" });
      }
      console.log("userID:", userId)
      // Find user by ID and select only the completed_courses field
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      console.log("Done:", user.completedCourses)
      res.status(200).json(user.completedCourses);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  updateCompletedCourses,
  getCompletedCourses
};