import { Ollama } from 'ollama';
//import ollama from 'ollama';
import {oldmessages} from './messages';
import axios from 'axios';

const metis = new Ollama({ host: 'http://127.0.0.1:11434' });
//probably change this to be called once.
let modelname = "llama3.2";
//let embedname = "mxbai-embed-large"
let userCourses = [];
let currentUser = '';
const messages = oldmessages;
let userInterest = '';
let installed = false;


async function listOllamaModels(modelName) {
  try {
    if(installed) return true;
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
    if(!installed) {
    const alreadyInstalled = await listOllamaModels(modelName);
    installed = alreadyInstalled;
    }
    console.log(installed);
    if(installed) {
      console.log(`Model "${modelName}" is already installed.`);
      return `Model "${modelName}" is alreasy installed!`;
    }

    console.log(`Pulling model: ${modelName}...`);

    const response = await axios.post('http://localhost:11434/api/pull', {
        name: modelName
    });

    console.log(`Model "${modelName}" pulled successfully!`);
    console.log('Details:', response.data);
    return `Model "${modelName}" pulled successfully!`;

  } catch (error) {
    console.error('Error pulling model:', error.response ? error.response.data : error.message);
  }
}

pullOllamaModel(modelname);


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
  return `classify topics for: ${question} from options:  
  1) Recommend course plan/classes/courses or any variation of this included in ${question} (recommend 3-4 specific courses) , 
  2) Classify queries that include variations of {"what is {course}", "what are the prereqs"} as find information for course given the courseID or title (example CS 100 or Software Construction), and the type of information from {title: course title, description: general information about course, PREREQS: list of the course's prerequisites, courseID: course id, units: amount of units the course is worth}} Return only courseID/title and the type of information from the list given (example: CS 100, description)
  3) Classify given user interests (example: \"I am interesed in {topic}, I like {topic}\") from ${question}
  4) None of the above
  ONLY respond with the topics classified. You can ONLY return one of the following:
  1. "1,2"
  2. "1,3"
  3. "1"
  4. "2"
  5. "3"
  6. "4"
  `
}

function promptInfo(question, courses) {
  return `classify courseId (ex: CS 105) or closest title (ex: Data Analysis Methods) of the one given in ${question} from ${courses} & classify information module from {title, courseID, description, PREREQS} for: ${question} \n ============ \n ONLY Give courseId/title`
}

function promptInfo2(question, course) {
  return `Give information for ${question} from context: ${course}`
}

//rephrase query to use context of course DB + requirements
function augment_prompt(query, completed, posCourses, interests) {
  return `Using the ONLY the context below, answer the query.
  Context: {
    Major: Computer Science,
    Interests: ${interests},
    Completed Courses: ${completed},
    Possible Next Courses: ${posCourses}
  }

  Query: ${query} Include the courseID when possible.`
}

//create embeds for courseDB and requirements (__TO FINISH__)
/* async function generateEmbeds(input) {
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
} */

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
async function updateUserCourses(newCourses, currentUser, completed){
  if (currentUser) {
    // Immediately trigger the API call to update the user's completed courses
    for(const courseName of newCourses) {
      if(!completed.includes(courseName)) {
        if(findCourse(courseName)) {
          axios.post(`${import.meta.env.VITE_API_URL}/api/users/updateCompleted`, {        
            userId: currentUser,  // currentUserId should be defined (e.g., passed as a prop)
            course: courseName,
            action: add
          }, { withCredentials: true })
        }
      }
    }
    const comp = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/getCompleted?userId=${encodeURIComponent(currentUser)}`,{withCredentials: true})
    console.log(comp.data)
    return `Done Updating: ${comp.data}`;
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
  console.log("Possible:", possible)
  console.log("Completed:", complete)
  const final = possible.filter(course => !complete.includes(course.courseID))
  console.log("Final:", final)
  return final
}

// Subtract two numbers function 
async function recommendCourses(completed) {
  console.log("Recommending courses for:", completed);

  const allCourses = await fetchAllCourses();
  //const formattedCourses = JSON.stringify(allCourses, null, 2);
  //const parsedCourses = JSON.parse(formattedCourses);
  const filteredCourses = allCourses.map(course => ({
    courseID: course.courseID,
    PREREQS: course.PREREQS,
    title: course.title
  }))

  console.log("Recommending courses...");
  let recommendedCoursePlan = []; //final classes to be recommended here (3-4 classes)

  console.log("All courses:\n", JSON.stringify(filteredCourses));
  console.log("Completed courses:\n", completed);
  const recommend = getAvailableCourses(filteredCourses, completed);
  console.log("Available courses:" , recommend);
  let finalPlan = removeTaken(recommend, completed)
  let fin = finalPlan.map(course => ({
    courseID: course.courseID,
    title: course.title
  }))
  console.log(fin)
  const ret = JSON.stringify(fin)
  //const ret = JSON.stringify(finDesc)
  //console.log("FINNN", finDesc)

  return `Here are all of the classes that you can take: ${ret}`;
}

function calculateProgress(completed) {
  let missing = []

  return `Here are the classes you still need to take ${JSON.stringify(missing)}`
}


//figure out what you want to do and act acordingly
//add help! for how to use the website (ie what the chatbot can do 
// eg(add interest, recommend quarter schedule, give info for a class, etc, basic info for how to use the nodes))
async function answer(input, currentUserId, completedCourses) {
  try {
    // Fetch courses
    const courses = await fetchAllCourses();
    currentUser = currentUserId;
    userCourses = []
    if(currentUserId) {
        // Immediately trigger the API call to update the user's completed courses
      const comp = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/getCompleted?userId=${encodeURIComponent(currentUserId)}`,{withCredentials: true})
      //console.log("Completed:", comp.data)
      userCourses = comp.data
    }
    if(!userCourses.length > 0) {
      userCourses = completedCourses
    }
    //add user info (year and quarter to user db) // keep for answer customization
    // Format course data
    const formattedCourses = JSON.stringify(courses, null, 2);
    const parsedCourses = JSON.parse(formattedCourses);
    //console.log("Parsed Course Data:", parsedCourses);
    //console.log("Formatted Course Data:", formattedCourses);
    //console.log("Course Data:", courses);
    console.log("Completed Courses:", userCourses);

    // Add course data to messages
   /*  messages.push({
      role: 'system',
      content: 
        `1. Using this course data:\n${formattedCourses}. Answer the query.
        2. These are the prerequisites that have been completed: ${completedCourses}.
        3. Only recommend 3-4 specific courses from the course data above.
        4. Keep responses short.`
    }); */

    // Add user input
    messages.push({role: 'user', content: prompt(input)})
    //console.log(messages.slice(-1)[0]);
    const res = await metis.chat({
      model: modelname || 'llama3.2',
      messages: messages,
    });

    
    let newPrompt = '';
    console.log("Answer 1:" ,res.message);
    const match1 = res.message.content.match(/\b[1]\b/); //recommend
    const match2 = res.message.content.match(/\b[2]\b/); // info
    const match3 = res.message.content.match(/\b[3]\b/); //interests
    console.log(`Matches 1-3:${match1}, ${match2}, ${match3}`)

   //recommend courses
    if(match1 || match2 || match3) {
      if(match3) {
        newPrompt =  `classify my fields of interest (ONLY words like: AI, math, etc) for ${input} ONLY give a list of fields (ONLY words, NO numbers) (ex: math, AI, CS)`
        messages.push({ role: 'user', content: newPrompt})
        const list = await metis.chat({
          model: modelname || 'llama3.2',
          messages: messages,
        });
        messages.push(list.message);
        console.log("Query:", list)
        let interests = list.message.content
        userInterest = interests

      }
      if(match1) {
        const valid = await recommendCourses(userCourses);
        console.log("VALID:" ,valid);
        //newPrompt = `choose the 3 or 4 courses from these ${recommend}`;
        newPrompt =augment_prompt(`1. From the available courses recommend 3-4 courses by their courseID. Reponse format: \"courseId, courseId, courseID\"`, userCourses, valid, userInterest);
        console.log("1st rec prompt", newPrompt)
        messages.push({ role: 'user', content: newPrompt})
        const list = await metis.chat({
          model: modelname || 'llama3.2',
          messages: messages,
        });
        messages.push(list.message);
        console.log("Query:", list)
        let str = list.message.content
        const rec = str.split(",").map(courseID => courseID.trim());
        let simplCourse = courses.filter(course => rec.includes(course.courseID)).map(course => ({
          courseID: course.courseID,
          title: course.title,
          description: course.description
        }))
        newPrompt =augment_prompt(`1.You MUST list ALL recommendations: ${JSON.stringify(rec)}. Response format: \"Based on your completed courses and interests, I would recommend the following courses:

          1. courseID
          2. courseID
          etc (for course in recommendations)
          
          Include some information or reasoning for each from {Possible Next Courses}
          `, userCourses, JSON.stringify(simplCourse), userInterest);
        //newPrompt = augment_prompt("1. From the available courses recommend 3-4 courses by their courseID. Response format: \"Based on your completed courses and prereqs, I would recommend these courses.\n 1.courseID\n 2. courseID\n etc bc reason\"", userCourses, valid, userInterest)
      }
      //give information for a course
      if(match2 && !match1) {
      messages.push({ role: 'system', content: 'Given this JSON formated course data, with structure {"courseID", "description", "title", "units"}'})
      let simplCourse = courses.map(course => ({
        courseID: course.courseID,
        title: course.title
      }))
      console.log("Courses", JSON.stringify(simplCourse))
      newPrompt =  promptInfo(input, JSON.stringify(simplCourse))
      console.log("Prompt:", newPrompt)
      messages.push({ role: 'user', content: newPrompt})
        const list = await metis.chat({
          model: modelname || 'llama3.2',
          messages: messages,
        });
        messages.push(list.message);
        console.log("Query:", list.message)
        let query = []
        query.push(list.message.content)
        let info = courses.filter(course => query.includes(course.courseID || course.title))
        newPrompt = promptInfo2(input, JSON.stringify(info))
        //messages.push({ role: 'user', content: newPrompt})
      }
  } else {
      const valid = await recommendCourses(userCourses);
      console.log("VALID:" ,valid);
      newPrompt = augment_prompt(input , userCourses, valid, userInterest)
      //messages.push({ role: 'user', content: augment_prompt(input, formattedCourses, userCourses)});
    }
    messages.push({ role: 'user', content: newPrompt});
    console.log("Augmented prompt:" , newPrompt);
    //console.log("Classification:", res.message);

    //messages.push({ role: 'user', content: augment_prompt(input, formattedCourses, userCourses)});
    //messages.push({ role: 'user', content: input});
    console.log(messages.slice(-1)[0]);

    // Generate AI response
    const res2 = await metis.chat({
      model: modelname || 'llama3.2',
      messages: messages,
    });

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
  pullOllamaModel,
};