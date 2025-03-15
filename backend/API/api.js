import { Ollama } from 'ollama';
import ollama from 'ollama';
import {oldmessages, schema} from './messages';
import axios from 'axios';

const metis = new Ollama({ host: 'http://127.0.0.1:11434' });
//probably change this to be called once.
let modelname = "llama3.2";
let embedname = "mxbai-embed-large"
let userCourses = [];
let currentUser = '';


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

//options for what chatbot can do.
function prompt(question) {
  return `classify topic for: ${question} from options: 
  1) Add user's interests, 
  2) Recommend course plan/classes (recommend 3-4 specific courses), 
  3) Information for course (course, type of info) from {course from provided course data, type from {"labHrs", "discHrs", "studyHrs", "PREREQS","flatPrereqs", "courseID", "description", "lectHrs", "title", "units"} } 
  4) Other. 
  Only respond with the topic classified.`
}

//rephrase query to use context of course DB + requirements
function augment_prompt(query, completedCourses, posCourses) {
  return `Using the ONLY the context below, answer the query.
  Context: {
    Major: Computer Science,
    Completed Courses: ${completedCourses},
    Possible Next Courses: ${posCourses}
  }

  Query: ${query}`
}

const messages = oldmessages;

//create embeds for courseDB and requirements (__TO FINISH__)
async function generateEmbeds(input) {
  try {
    const embed = await pullOllamaModel(embedname);
    console.log(`Generating embeddings: ...`);
    let courseEmbeddings = [];
    for (const course of input) {
      const textToEmbed = `${course.courseID}: ${course.PREREQS}`
      console.log("input: ", textToEmbed);
      const response = ollama.embed({
        model: embedname,
        input: textToEmbed
      });
      
      console.log(`Embedding for "${course.courseID}" (${course.description}):`);
      console.log((await response).embeddings);
      return response;
    }
    console.log(`Embedding created successfully!`);


  } catch (error) {
      console.error('Error creating embedding:', error.response ? error.response.data : error.message);
  }
}

// just to find if the user completed course actually exists in DB
async function findCourse(course) {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses?name=${encodeURIComponent(courseName)}`, {withCredentials: true});
    if (response.status === 200) {
      console.log("Course found:", response.data);
      return true;
    }
    return false;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log("Course not found.");
    } else {
      console.error("API request failed:", error.message);
    }
  }
}


//if the option is add completed courses --> run this
function updateUserCourses(completedCourses){
  if (currentUser) {
    // Immediately trigger the API call to update the user's completed courses
    for(const courseName of completedCourses) {
        if(findCourse(courseName)) {
          axios.post(`${import.meta.env.VITE_API_URL}/api/users/updateCompleted`, {        
            userId: currentUser,  // currentUserId should be defined (e.g., passed as a prop)
            course: courseName,
            action: add
          }, { withCredentials: true })
      }
    }
    return `Done Updating: ${completedCourses}`;
  }
  return "No updates made";
}

function hasCompletedPrereqs(prereqs, completedCourses) {
  if (!prereqs || prereqs.length === 0) return true; // No prereqs, course is available
  return prereqs.every(group => {
      return checkPrereqGroup(group, completedCourses);
  });
}

function checkPrereqGroup(group, completedCourses) {
  if (group.type === '&&') {
      // ALL prereqs must be completed
      return group.courses.every(course => checkPrereqCourse(course, completedCourses));
  } else if (group.type === '||') {
      // At least ONE prereq must be completed
      return group.courses.some(course => checkPrereqCourse(course, completedCourses));
  }
  return false;
}

function checkPrereqCourse(course, completedCourses) {
  if (typeof course === 'string') {
      return completedCourses.includes(course);
  } else if (course.prereqName) {
      return completedCourses.includes(course.prereqName);
  } else if (course.type && course.courses) {
      return checkPrereqGroup(course, completedCourses);
  }
  return false;
}

function getAvailableCourses(allCourses, completedCourses) {
  return allCourses.filter(course => hasCompletedPrereqs(course.PREREQS, completedCourses)).map(course => ({
    courseID: course.courseID,
    title: course.title,
    PREREQS: course.PREREQS.map(prereq => ({
      type: prereq.type,
      courses: prereq.courses.map(c => ({
        preReqName: c.prereqName || null
      })).filter(c => c.preReqName) // Remove undefined prerequisite names
    }))
  }));
}

function removeTaken(possible, complete) {
  return possible.filter(course => !complete.includes(course))
}

// Subtract two numbers function 
async function recommendCourses(completed) {
  console.log("Recommending courses for:", completed);

  const allCourses = await fetchAllCourses();
  //const formattedCourses = JSON.stringify(allCourses, null, 2);
  //const parsedCourses = JSON.parse(formattedCourses);
  const filteredCourses = allCourses.map(course => ({
    courseID: course.courseID,
    PREREQS: course.PREREQS
  }))

  console.log("Recommending courses...");
  let recommendedCoursePlan = []; //final classes to be recommended here (3-4 classes)

  console.log("All courses:\n", JSON.stringify(filteredCourses));
  console.log("Completed courses:\n", completed);
  const recommend = getAvailableCourses(filteredCourses, completed);
  console.log("Available courses:" , recommend);
  let finalPlan = removeTaken(recommend, completed)
  let fin = finalPlan.map(course => ({
    courseID: course.courseID
  }))
  const ret = JSON.stringify(fin)
  console.log(fin)

  return `Here are all of the classes that you can take: ${fin}`;
}

// Tool definition for recommend function
const recommendCoursesTool = {
  type: 'function',
  function: {
      name: 'recommendCourses',
      description: 'recommends classes/ a course plan the user can take based on the completed classes',
      parameters: {
          type: 'object',
          properties: {
              completed: { 
                  type: 'string',
                  description: 'list of classes taken'
              }
            },
          required: ['completed'],
      }
  }
};

const updateUserCoursesTool = {
  type: 'function',
  function: {
    name: 'updateUserCourses',
    description: 'Updates database with user\'s completed courses. Returns \"Done\"',
    parameters: {
      type: 'object',
      properties: {
        completedCourses: { 
          type: 'array',
          items: { type: 'string' },
          description: 'List of completed course names'
        }
      }
    },
    required: ['completedCourses']
  }
};

/* const Course = await fetchAllCourses;

use.load().then(async model => {
   const sampleCourse = Course[0];
   const embeddings = await model.embed(sampleCourse['PREREQS']);
   console.log(embeddings.arraySync());
}); */


//figure out what you want to do and act acordingly
//add help! for how to use the website (ie what the chatbot can do 
// eg(add interest, recommend quarter schedule, give info for a class, etc, basic info for how to use the nodes))
async function answer(input, currentUserId, completedCourses) {
  try {
    // Fetch courses
    const courses = await fetchAllCourses();
    //add user info (year and quarter to user db) // keep for answer customization
    userCourses = completedCourses;
    currentUser = currentUserId;
    // Format course data
    const formattedCourses = JSON.stringify(courses, null, 2);
    const parsedCourses = JSON.parse(formattedCourses);
    console.log("Parsed Course Data:", parsedCourses);
    console.log("Formatted Course Data:", formattedCourses);
    console.log("Course Data:", courses);
    console.log("Completed Courses:", completedCourses);
    //const embeddings = await generateEmbeds(formattedCourses);
    //const embeds = embeddings.embeddings;
    // Log courses
    //console.log("Formatted Course Data:", embeddings.embeddings);
    

    // Add course data to messages
   /*  messages.push({
      role: 'system',
      content: 
        `1. Using this course data:\n${formattedCourses}. Answer the query.
        2. These are the prerequisites that have been completed: ${completedCourses}.
        3. Only recommend 3-4 specific courses from the course data above.
        4. Keep responses short.`
    }); */

    messages.push({
      role: 'system',
      content: `You MUST use one of the following tools to answer: 
      - recommendCourses: Returns courses the user is eligible to take based on completed prerequisites.
      - updateUserCourses: Updates the user's completed courses.`
    });
    // Add user input
    messages.push({role: 'user', content: prompt(input)});
    console.log(messages.slice(-1)[0]);
    const res = await metis.chat({
      model: modelname || 'llama3.2',
      messages: messages,
      tool_calls: [ recommendCoursesTool, updateUserCoursesTool]
    });

    
    let newPrompt = '';
    console.log("Answer 1:" ,res.message);
    const match = res.message.content.match(/\b[2]\b/);
    console.log("Match:" ,match);
    if(match) {
      const filteredCourses = courses.map(course => ({
        courseID: course.courseID,
        PREREQS: course.PREREQS
      }))
      let newFormat = JSON.stringify(filteredCourses, null, 2);
      const valid = await recommendCourses(completedCourses);
      console.log("VALID:" ,valid);
      //console.log("New Format: " ,newFormat);
/* 
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 200,
        chunkOverlap: 0,
      });
      const texts = await textSplitter.splitText(formattedCourses);

      const response  = await metis.embed({
        model: embedname,
        input: texts,
      })

      inputRes = await metis.embed({
        model: embedname,
        input: input,
      }) */



      //const embeddings = await generateEmbeds(formattedCourses)
      //const embeds = embeddings.embeddings

      //let recommend = recommendCourses(formattedCourses, completedCourses);
      //console.log("Recommended:" ,recommend);
      //newPrompt = `choose the 3 or 4 courses from these ${recommend}`;
      newPrompt = augment_prompt("1.Find all courses whose prereqs I've completed. Do not explicitly say this in your final response. 2. From the courses in 1, recommend 3-4 courses. Prioritize courses whose PREREQS I have already taken (or have no PREREQS) which are also the most common PREREQS for other courses. Only respond with: \"I would recommend these courses. 1.courseID1, 2. courseID2, etc and a short reason\"", completedCourses, valid)
    }
    else {
      newPrompt = augment_prompt(input, completedCourses, formattedCourses);
      //messages.push({ role: 'user', content: augment_prompt(input, formattedCourses, completedCourses)});
    }
    messages.push({ role: 'user', content: newPrompt});
    console.log("Augmented prompt:" , newPrompt);
    //console.log("Classification:", res.message);

    //messages.push({ role: 'user', content: augment_prompt(input, formattedCourses, completedCourses)});
    //messages.push({ role: 'user', content: input});
    console.log(messages.slice(-1)[0]);

    const availableFunction = {
      recommendCourses: recommendCourses,
      updateUserCourses: updateUserCourses
    }

    // Generate AI response
    const res2 = await metis.chat({
      model: modelname || 'llama3.2',
      messages: messages,
      tool_calls: [recommendCoursesTool, updateUserCoursesTool]
    });

    if (res2.message.tool_calls) {
      // Process tool calls from the response
      for (const tool of response.message.tool_calls) {
          const functionToCall = availableFunctions[tool.function.name];
          if (functionToCall) {
              console.log('Calling function:', tool.function.name);
              console.log('Arguments:', tool.function.arguments);
              output = functionToCall(tool.function.arguments);
              console.log('Function output:', output);

              // Add the function response to messages for the model to use
              messages.push(response.message);
              messages.push({
                  role: 'tool',
                  content: output.toString(),
              });
          } else {
              console.log('Function', tool.function.name, 'not found');
          }
        }
      }

    console.log(res2);
    messages.push(res2.message);
    return res2;
  } catch (error) {
    console.error("Error:", error);
    return { message: "Error fetching data" };
  }
}

export {
  answer,
  fetchAllCourses, 
  generateEmbeds, 
  pullOllamaModel,
};