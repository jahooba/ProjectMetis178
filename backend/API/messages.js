//import { data, requirements } from '../API/context' //this is going to hold the course information

export const oldmessages= [
  //{role:'system', content:"I am an a helper named Metis, something like an advisor, I help with inquiries about course schedules and topics surrounding that, for UCR BCOE (Bournes College of Engineering) students."}, //give context to the bot in it's identity
  {role: 'system', content: "You are a helpful assistant named Metis that is an expert at recommending courses based on completed prerequisites and providing information about said courses."},
  {role: 'system', content: "If you do not know the answer. Respond \"I'm sorry, I don't know."},
  {role: 'user', content: "Can you give me a course plan for the next quarter?"},
  {role: 'assistant', content: "Based on your completed courses and prereqs, you should take CS 010A, ENGR 001I, and MATH 009A"}, // outline for how to recommend course plan for quarter.
  {role: 'system', content: `Using the course data below, answer the query with specific courses. If the person has not completed any prerequisites, only recommend classes with no prerequisites.`},
  //{role: 'assistant', content: 'From JSON data provided with structure {"PREREQS","flatPrereqs","courseID", "description", "labHrs", "studyHrs", "title", "units"}\n' + JSON.stringify(data)},
  //{role: 'assistant', content: "Find the minimum amount of classes needed to complete the major." + 'From JSON data provided with structure {"lowerDivs", "lowerDivUnits", "upperDivs", "upperDivUnits"}' + JSON.stringify(requirements)},
  //{ role: 'user', content: input } //pass in information from user
  //generate a response to above using past messages as context.
];