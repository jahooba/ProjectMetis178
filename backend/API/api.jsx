import { Ollama } from 'ollama';
import { data } from '../API/context' //this is going to hold the course information
//import ollama from 'ollama'

//const mongoose = require('mongoose');
//mongoose.connect(process.env.MONGO_URL); //update to classdb?

/* const courseSchema = new mongoose.Schema({
  PREREQS: Int[],
  flatPrereqs: Int[],
  courseID: String,
  description: String,
  PREREQS: Int[],
  flatPrereqs: Int[],
  labHrs: Int,
  studyHrs: Int,
  title: String,
  units: Int,
}); */

//const Course = mongoose.model('Course', courseSchema);

/* async function connectToMongoDB() {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
} */

/* async function listDatabases(mongoose){
  databasesList = await mongoose.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}; */


const metis = new Ollama({ host: 'http://127.0.0.1:11434' });

function prompt(question) {
  return `classify parent module name for: ${question} \n ============ \n Give information pertaining to it`
}

const messages= [
  {role:'system', content:"I am an a helper named Metis, something like an advisor, I help with inquiries about course schedules and topics surrounding that, for UCR BCOE (Bournes College of Engineering) students."}, //give context to the bot in it's identity
  {role: 'system', content: 'From JSON data provided with structure {"PREREQS","flatPrereqs","courseID", "description", "labHrs", "studyHrs", "title", "units"}\n' + JSON.stringify(data)}
  //{ role: 'user', content: input } //pass in information from user
  //generate a response to above using past messages as context.
];




async function answer(input) {
  messages.push({ role: 'user', content: input });
  const res = await metis.chat({
    model: 'llama3.2:1b',
    messages: messages
  });
  messages.push(res.message);
  return res;
}
export default answer;

/* const response2 = await metis.generate({

}) */

//
/* const modelfile = `
FROM llama3.2:1b
SYSTEM "You are mario from super mario bros."
`

await ollama.create({ model: 'example', modelfile: modelfile }) */