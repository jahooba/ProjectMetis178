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
    console.log("Fetched Course Data:", response.data); // Log the course data to the console
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
  Add interests, 2) Reccomend course plan/ classes, 3) Information for course, 
  (course, type of info) from {course from provided course data, type from structure {"labHrs", "discHrs", "studyHrs", "PREREQS","flatPrereqs", "courseID", "description", "lectHrs", "title", "units"} } 4. Other`
}

const messages = oldmessages;

async function generateEmbeds(input) {
  try {
      const embed = await pullOllamaModel(embedname);
      console.log(`Generating embeddings: ...`);
      let courseEmbeddings = [];
      for (const course of input) {
        const textToEmbed = `${course.courseID}: ${course.description}`
        console.log("input: ", textToEmbed);
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
        `1. For all queries, only use this course data:\n${parsedCourses}. Use only data from the provided course data.
        2. This is the schema for the course data: [
        const nestedLogicSchema = new mongoose.Schema({
            type: {
                type: String,
                enum: ['&&', '||'],
                required: true
            },
            courses: [{type: mongoose.Schema.Types.Mixed /* allows recursive nesting */}]
        });
        
        const singleCourseSchema = new mongoose.Schema({
            _id: mongoose.Schema.Types.Mixed,
            concurrent: {
                type: Boolean,
                default: false
            }
        }, {_id: false /* prevents new Mongo ids */});
        
        const prereqSchema = new mongoose.Schema({
            type: {
                type: String,
                enum: ['&&', '||'],
                required: true
            },
            courses: [
                singleCourseSchema,
                nestedLogicSchema
            ]
        });
        
        const courseSchema = new mongoose.Schema({
            courseID: {
                type: String,
                required: true,
                unique: true,
                match: /^[A-Z]{2,4} \d{3}[A-Z]?$/
            },
            title: {
                type: String,
                required: true,
                unique: false
            },
            units: {
                type: Number,
                min: 0,
                max: 12,
                default: 0
            },
            lectHrs: {
                type: Number,
                min: 0,
                max: 12,
                default: 0
            },
            labHrs: {
                type: Number,
                min: 0,
                max: 12,
                default: 0
            },
            discHrs: {
                type: Number,
                min: 0,
                max: 12,
                default: 0
            },
            studyHrs: {
                type: Number,
                min: 0,
                max: 12,
                default: 0
            },
            PREREQS: [prereqSchema],
            description: {
                type: String,
                required: true
            },
            flatPrereqs: [
                {
                    type: mongoose.Schema.Types.Mixed,
                    required: false,
                    default: []
                }
            ]
        }, {collection: 'courses'});]
        3. Keep responses short.`
    });
    // Add user input
    messages.push({role: 'user', content: prompt(input)});
    let inquiry = messages.slice(-1)[0];
    console.log(inquiry.content);
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