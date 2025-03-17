//import { data, requirements } from '../API/context' //this is going to hold the course information

export const oldmessages= [
  //{role:'system', content:"I am an a helper named Metis, something like an advisor, I help with inquiries about course schedules and topics surrounding that, for UCR BCOE (Bournes College of Engineering) students."}, //give context to the bot in it's identity
  {role: 'system', content: `You are a helpful assistant named Metis that is an expert at recommending courses based on completed prerequisites and interests. 
    You are also an expert at providing information about courses.
     All students who ask you questions are Computer Science Majors.`},
  {role: 'system', content: "If you do not know the answer. Respond \"I'm sorry, I don't quite understand. Can you rephrase your question?"},
  {role: 'user', content: "Can you give me a course plan for the next quarter?"},
  {role: 'assistant', content: "Based on your completed courses and prereqs, you should take CS 010A, ENGL 001A, ENGR 001I, and MATH 009A"},
  {role: 'user', content: `classify actions for: 
    Query: CS 100
    from options:  
  1) Recommend course plan/classes/courses or any variation of this included in query (recommend 3-4 specific courses) , 
  2) Give information for a specific course given a courseID or course title (example: CS 105 or Data Analysis Methods) from query
  3) Classify my interests (example: \"I am interesed in AI\" returns AI, \"I like math\" returns math) from query
  4) None of the above

  ONLY respond with the actions classified. You can ONLY return one of the following:
  1. "1,3"
  2. "1"
  3. "2"
  4. "3"
  5. "4"
  `},
  {role: 'assistant', content: '2'},
  {role: 'user', content: `classify actions for: 
    Query: What is CS 100
    from options:  
  1) Recommend course plan/classes/courses or any variation of this included in query (recommend 3-4 specific courses) , 
  2) Give information for a specific course given a courseID or course title (example: CS 105 or Data Analysis Methods) from query
  3) Classify my interests (example: \"I am interesed in AI\" returns AI, \"I like math\" returns math) from query
  4) None of the above

  ONLY respond with the actions classified. You can ONLY return one of the following:
  1. "1,3"
  2. "1"
  3. "2"
  4. "3"
  5. "4"
  `},
  {role: 'assistant', content: '2'},
  {role: 'user', content: `classify actions for: 
    Query: recommend courses
    from options:  
  1) Recommend course plan/classes/courses or any variation of this included in query (recommend 3-4 specific courses) , 
  2) Give information for a specific course given a courseID or course title (example: CS 105 or Data Analysis Methods) from query
  3) Classify my interests (example: \"I am interesed in AI\" returns AI, \"I like math\" returns math) from query
  4) None of the above

  ONLY respond with the actions classified. You can ONLY return one of the following:
  1. "1,3"
  2. "1"
  3. "2"
  4. "3"
  5. "4"
  `},
  {role: 'assistant', content: '1'},
  {role: 'user', content: `classify actions for: 
    Query: What classes should I take next
    from options:  
  1) Recommend course plan/classes/courses or any variation of this included in query (recommend 3-4 specific courses) , 
  2) Give information for a specific course given a courseID or course title (example: CS 105 or Data Analysis Methods) from query
  3) Classify my interests (example: \"I am interesed in AI\" returns AI, \"I like math\" returns math) from query
  4) None of the above

  ONLY respond with the actions classified. You can ONLY return one of the following:
  1. "1,3"
  2. "1"
  3. "2"
  4. "3"
  5. "4"
  `},
  {role: 'assistant', content: '2'},
  {role: 'user', content: `classify actions for: 
    Query: I like AI, what classes do you recommend
    from options:  
  1) Recommend course plan/classes/courses or any variation of this included in query (recommend 3-4 specific courses) , 
  2) Give information for a specific course given a courseID or course title (example: CS 105 or Data Analysis Methods) from query
  3) Classify my interests (example: \"I am interesed in AI\" returns AI, \"I like math\" returns math) from query
  4) None of the above

  ONLY respond with the actions classified. You can ONLY return one of the following:
  1. "1,3"
  2. "1"
  3. "2"
  4. "3"
  5. "4"
  `},
  {role: 'assistant', content: '1,3'},
  {role: 'user', content: `classify courseId (ex: CS 105) or closest title (ex: Data Analysis Methods) of the one given in [ What is cs100?] from:  
  \n ============ \n 
  ONLY Give courseId/title`
    },
  {role: 'assistant', content: 'CS 100'},
  {role: 'user', content: `classify courseId (ex: CS 105) or closest title (ex: Data Analysis Methods) of the one given in [cs100] from: 
  \n ============ \n 
  ONLY Give courseId/title`
    },
  {role: 'assistant', content: 'CS 100'},
  {role: 'user', content: `classify courseId (ex: CS 105) or closest title (ex: Data Analysis Methods) of the one given in [cs 100 description] from: 
  \n ============ \n 
  ONLY Give courseId/title`
    },
  {role: 'assistant', content: 'CS 100'},
  //generate a response to above using past messages as context.
];