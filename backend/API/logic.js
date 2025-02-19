import axios from 'axios'

///add course logic ie how to reecomend classes and check what has been completed
async function addUserInfo(info) {
    //connect to mongodb
    //finduser
    //parse (could use AI to find this info for now)
    //.insert (year, major, etc)
    
}

/* const mongoose = require("mongoose");
const User = require("./models/User"); // Import User model
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function addInterestsField() {
    try {
        await User.updateMany({}, { $set: { interests: [] } }); // Add empty interests array
        console.log("Interests field added to all users.");
        mongoose.connection.close();
    } catch (error) {
        console.error("Error updating users:", error);
    }
}

addInterestsField(); */

//filter to only return the name and prereqs
// CS010C: CS010B or CS009C : 4 units 
function filterCourseReqs(courseData) {
    let summary = {};

    for (let category in courseData) {
        summary[category] = Object.entries(courseData[category]).map(([courseID, courseInfo]) => ({
            name: courseInfo.name,
            prereqs: courseInfo.prereqs,
            units: courseInfo.units
        }));
    }

    return summary;
}

//course, completed[], standing str
// returns bool status (if all prereqs done Y/N), missing[] (any prereqs yet to be completed)
// pass in class prereqs, all completed classes, current standing
function checkCompletion(course, completed, standing) {
    let missing =[]; //store missing prereqs here
    let status = false; //keep overall track

    //check if prereq in student 
    function checkPreReqs(prereq) {
        if(prereq.type === '&&') {
            status = prereqs.courses.every(checkPreReqs)
            return status
        }
        else if(prereq.type === '||') {
            status = prereqs.courses.some(checkPreReqs)
            return status
        }
        else {
            status = completed.includes(prereq._id);
            if(status == false) missing.push(prereq._id);
            return status
        }
    }
    return course.PREREQS.every(checkPreReqs);
}


function recommend(courses, completed, standing) {
    let coursePlan = [];
    //add 3-5 courses to course plan based on completed and standing/year
    //
    for(let category in courses) {

        if (coursePlan.length > 5) {
            break;
        }
    }
    return coursePlan;
}

export default {checkPreReqs, recommend, addUserInfo};