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
  return `classify actions for: 
    Query: ${question}

    from options:  
  1) Recommend course plan/ classes/ courses or any variation of this included in query (recommend 3-4 specific courses) , 
  2) Give information about a specific course given a courseID or course title (example: What is CS 105 or What is Data Analysis Methods) from query
  3) List my interests (example: \"I am interesed in AI\" returns AI, \"I like math\" returns math) from query
  4) None of the above

  ONLY respond with the actions classified. You can ONLY return one of the following:
  1. "1,3"
  2. "1"
  3. "2"
  4. "3"
  5. "4"
  `
}

function interestPrompt(query) {
return `Classify my listed interests (example: \"I am interesed in AI\" returns AI, \"I like math\" returns math) from ${query} ONLY give interest list (ex: math, AI, logic puzzles)`
}

function promptInfo(question, courses) {
  return `classify courseId (ex: CS 105) or closest title (ex: Data Analysis Methods) of the one given in [${question}] from: ${courses} \n ============ \n ONLY Give courseId/title. If there are no matches respond NONE`
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
    All courses I can take: ${posCourses}
  }

  Query: ${query} Use the courseID when possible.`
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

//catch an info query
function containsCourseID(query, courses) {
  const lowerStr = query.toLowerCase(); // Normalize input string to lowercase
  //console.log(lowerStr)
  
  return courses.some(course => {
      const courseIDs = course.courseID.toLowerCase().replace(/\s*/g, ''); // Normalize course IDs
      const normalizedQuery = lowerStr.replace(/\s*/g, '');
      //console.log(JSON.stringify(courseIDs))
      //console.log(normalizedQuery)
      return normalizedQuery.includes(courseIDs);
  });
}

//find what course we need info from
function getMatchingCourseIDs(str, courses) {
  const lowerStr = str.toLowerCase(); // Normalize input string to lowercase
  let matches = [];

  courses.forEach(course => {
      const courseID = course.courseID.toLowerCase().replace(/\s*/g, '') // Normalize course IDs
      //console.log(JSON.stringify(courseID))
      const pattern = `\\b${courseID.replace(/\s*/g, '\\s*')}\\b`
      //console.log(pattern)
      if (new RegExp(pattern, 'i').test(lowerStr)) {
        matches.push(course.courseID); // Store matched courseID in uppercase (original format)
      }
  });
  console.log("Match:", matches)
  return matches.length > 0 ? matches : null; // Return matches or null if none found
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

function checkProject(course) {
  
}

function checkTE(course) {
  
}

function checkDepth(course) {
  
}

function prioCourse(possible) {

  return prio;
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
    let simplCourse = courses.map(course => ({
      courseID: course.courseID,
    }))
    currentUser = currentUserId;
    userCourses = []
    let newPrompt = '';

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
    let match1 = false
    let match2 = false
    let match3 = false
    let infoCourses = [];
    // Check if query references a course (only courseID)
    console.log("infoMatch:", containsCourseID(input, simplCourse))
    if(containsCourseID(input, simplCourse)) {
      infoCourses = getMatchingCourseIDs(input, simplCourse);
      match2 = true;
      
    }
    console.log("Info", match2)
    // Add user input


    if(!match2) {
      messages.push({role: 'user', content: prompt(input)})
      //console.log(messages.slice(-1)[0]);
      const res = await metis.chat({
        model: modelname || 'llama3.2',
        messages: messages,
      });
      messages.push(res.message)
      console.log("Answer 1:" ,res.message);
      match1 = res.message.content.match(/\b[1]\b/); //recommend
      match2 = res.message.content.match(/\b[2]\b/); // info
      match3 = res.message.content.match(/\b[3]\b/); //interests
      console.log(`Matches 1-3:${match1}, ${match2}, ${match3}`)
    }

   //recommend courses
    if(match1 || match2 || match3) {
      if(match3) {
        newPrompt =  interestPrompt(input)
        messages.push({ role: 'user', content: newPrompt})
        const list = await metis.chat({
          model: modelname || 'llama3.2',
          messages: messages,
        });
        messages.push(list.message);
        console.log("Query:", list)
        let interests = list.message.content
        userInterest = interests
        match1 = true
      }
      //give information for a course
      if(match2) {
          /* messages.push({ role: 'system', content: 'Given this JSON formated course data, with structure {"courseID", "description", "title", "units"}'})
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
            infoCourses.push(list.message.content) */
            let info = courses.filter(course => infoCourses.includes(course.courseID || course.title))
            newPrompt = promptInfo2(input, JSON.stringify(info))
            if(!infoCourses) {
              match1 = true
              match2 = false
            }
          //messages.push({ role: 'user', content: newPrompt})
        }
        if(match1 && !match2) {
        const valid = await recommendCourses(userCourses);
        console.log("VALID:" ,valid);
        //newPrompt = `choose the 3 or 4 courses from these ${recommend}`;
        newPrompt =augment_prompt(`1. From the available courses recommend 5-6 courses by their courseID. Reponse format: \"courseId, courseId, courseID\"`, userCourses, valid, userInterest);
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
        simplCourse = courses.filter(course => rec.includes(course.courseID)).map(course => ({
          courseID: course.courseID,
          title: course.title,
          description: course.description
        }))
        newPrompt =augment_prompt(`1. You MUST list 3-4 recommendations THEN may include the remaining courses as alternatives, from: ${JSON.stringify(rec)}
        Do NOT give duplicate courseIDs. 
        2. Response format: 
        \"Based on your completed courses and interests, I would recommend the following courses:

          1. courseID1
          2. courseID2
          3. courseID3
          4. courseID4
          alternative: courseID5
          alternative: courseID6
          etc (for course in recommendations)

          Include some information or reasoning for each from {All courses I can take}
          `, userCourses, JSON.stringify(simplCourse), userInterest);
        //newPrompt = augment_prompt("1. From the available courses recommend 3-4 courses by their courseID. Response format: \"Based on your completed courses and prereqs, I would recommend these courses.\n 1.courseID\n 2. courseID\n etc bc reason\"", userCourses, valid, userInterest)
      }
  } else {
      const valid = await recommendCourses(userCourses);
      simplCourse = courses.filter(course => valid.includes(course.courseID)).map(course => ({
        courseID: course.courseID,
        title: course.title,
        description: course.description
      }))
      console.log("VALID:" ,simplCourse);
      newPrompt = augment_prompt(input , userCourses, JSON.stringify(simplCourse), userInterest)
      console.log("Prompt:" , newPrompt);
      //messages.push({ role: 'user', content: augment_prompt(input, formattedCourses, userCourses)});
    }
    messages.push({ role: 'user', content: newPrompt});
    console.log("Augmented prompt:" , newPrompt);
    //console.log("Classification:", res.message);

    //messages.push({ role: 'user', content: augment_prompt(input, formattedCourses, userCourses)});
    //messages.push({ role: 'user', content: input});

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