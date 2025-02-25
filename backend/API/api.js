import { Ollama } from 'ollama';
import ollama from 'ollama';
import {oldmessages} from './messages';
import axios from 'axios';
//import tf from '@tensorflow/tfjs-node';

const metis = new Ollama({ host: 'http://127.0.0.1:11434' });
//probably change this to be called once.
let modelname = "llama3.2";
let embedname = "mxbai-embed-large"

async function listOllamaModels(modelName) {
    try {
        const response = await axios.get('http://localhost:11434/api/tags');
        const models = response.data.models.map(model => model.name);
        console.log('Available Ollama Models:');
        models.forEach((model, index) => {
            console.log(model);
        });
        return (models.includes(modelName) || models.includes(`${modelName}:latest`));
    } catch (error) {
        console.error('Error checking installed models:', error.response ? error.response.data : error.message);
        return false;
    }
}

async function pullOllamaModel(modelName) {
    try {
        const alreadyInstalled = await listOllamaModels(modelName);
        console.log(alreadyInstalled);
        if(alreadyInstalled) {
          console.log(`Model "${modelName}" is already installed.`);
          return;
        }

        console.log(`Pulling model: ${modelName}...`);

        const response = await axios.post('http://localhost:11434/api/pull', {
            name: modelName
        });

        console.log(`Model "${modelName}" pulled successfully!`);
        console.log('Details:', response.data);
    } catch (error) {
        console.error('Error pulling model:', error.response ? error.response.data : error.message);
    }
}

// Replace 'llama3' with the model you want to pull
//pullOllamaModel(modelname);


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

/*
async function addUserInfo() {
  try {
    console.log("✅ Connected to MongoDB");
    const user = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`); // Ensure the API route is correct
    //console.log("Fetched Course Data:", response.data); // Log the course data to the console
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [0];
  }
}
*/

//modify better
function prompt(question) {
  return `classify topic for: ${question} from options: 1) 
  Add interests, 2) Reccomend course plan/ classes, 3) Information for course, (course, type of info) 4. Other ${question} \n ============ \n Give information pertaining to it`
}

const messages = oldmessages;

async function generateEmbeds(input) {
  try {
      const embed = await pullOllamaModel(embedname);
      console.log(`Generating embeddings: ...`);
      let courseEmbeddings = [];
      for (const course of input) {
        const textToEmbed = `${course.courseID}: ${course.description}`
        //console.log("input: ", textToEmbed);
        const response = ollama.embed({
          model: embedname,
          input: textToEmbed
        });
        console.log(`Embedding for "${course.courseID}" (${course.description}):`);
        console.log((await response).embeddings);
      }

      console.log(`Embedding created successfully!`);
  } catch (error) {
      console.error('Error creating embedding:', error.response ? error.response.data : error.message);
  }
}


async function answer(input) {
  try {
    // Fetch courses
    const courses = await fetchAllCourses();
    //add user info (year and quarter to user db) // keep for answer customization

    // Format course data
    const formattedCourses = JSON.stringify(courses, null, 2);
    const parsedCourses = JSON.parse(formattedCourses);
    console.log("Parsed Course Data:", parsedCourses);
    //const embeddings = await generateEmbeds(courses);
    // Log courses
    //console.log("Formatted Course Data:", formattedCourses);
    

    // Add course data to messages
    messages.push({
      role: 'system',
      content: 
        `1. Here is the course data:\n${parsedCourses}. Use only data from the provided course data.
        2. Keep responses short.`
    });
    messages.push({ role: 'system', content: 'Given this JSON formated course data, with structure {"labHrs", "discHrs", "studyHrs", "PREREQS","flatPrereqs", "courseID", "description", "lectHrs", "title", "units"}\n' + formattedCourses},
    { role: 'user', content: 'Here are the available courses: \n' + {parsedCourses} + '.If a student has taken MATH 003 and CS 010A, what courses should they take next?' });

    // Add user input
    //messages.push({role: 'system', content: prompt(input)});
    messages.push({ role: 'user', content: input });

    // Generate AI response
    const res = await metis.chat({
      model: modelname || 'llama3.2',
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