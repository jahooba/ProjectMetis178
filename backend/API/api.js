import { Ollama } from 'ollama';
import {oldmessages} from './messages';
import axios from 'axios';

const metis = new Ollama({ host: 'http://127.0.0.1:11434' });
//probably change this to be called once.

async function fetchAllCourses() {
  try {
    console.log("✅ Connected to MongoDB");
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses/all`); // Ensure the API route is correct
    //console.log("Fetched Course Data:", response.data); // Log the course data to the console
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [0];
  }
}


function prompt(question) {
  return `classify parent module name for: ${question} \n ============ \n Give information pertaining to it`
}

const messages = oldmessages;


async function answer(input) {
  try {
    // Fetch courses
    const courses = await fetchAllCourses();
    //add user info (year and quarter to user db) // keep for answer customization

    // Format course data
    const formattedCourses = JSON.stringify(courses, null, 2);
    const parsedCourses = JSON.parse(formattedCourses);
    // Log courses
    //console.log("Formatted Course Data:", formattedCourses);
    console.log("Parsed Course Data:", parsedCourses);

    // Add course data to messages
    messages.push({
      role: 'system',
      content: `Here is the course data:\n${parsedCourses} can you return only the data prompted by the user?`
    });
    messages.push({ role: 'system', content: 'Given this JSON formated course data, with structure {"labHrs", "discHrs", "studyHrs", "PREREQS","flatPrereqs", "courseID", "description", "lectHrs", "title", "units"}\n' + formattedCourses},
    { role: 'user', content: 'Here are the available courses: \n' + {parsedCourses} + '.If a student has taken MATH 003 and CS 010A, what courses should they take next?' });

    // Add user input
    messages.push({ role: 'user', content: input });

    // Generate AI response
    const res = await metis.chat({
      model: 'llama3.2:1b',
      messages: messages
    });

    messages.push(res.message);
    return res;
  } catch (error) {
    console.error("Error:", error);
    return { message: "Error fetching data" };
  }
}

export default answer;