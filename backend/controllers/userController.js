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

module.exports = {
  updateCompletedCourses,
};