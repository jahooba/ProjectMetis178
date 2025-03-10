import logo from '../../assets/homepageAssets/logo.png';
import sidebarIcon from '../../assets/visualizationAssets/sidebar-icon.png'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react'
import { useState } from 'react';
import answer from '../../../../backend/API/api'
//import ollama from 'ollama'
//import { Ollama } from 'ollama';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import CourseTree from './CourseTree';

import { Link } from 'react-router-dom';


import styles from './Visualization.module.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const Visualization = () => {
  const [chatVisible, setChatVisible] = useState(false);
  const { user } = useContext(UserContext);
  console.log("User from context:", user);

  const currentUserId = user?._id;
  const completedCourses = user?.completedCourses;

  const toggleChat = () => {
    setChatVisible(!chatVisible);
  };

  const [typing, setTyping] = useState(false);

  const [messages, setMessages] = useState([
    {
      message: "Hello, I am Metis!!!",
      sender: "Metis",
      direction: "incoming"
    },
    {
      message: "Please enter your school year and quarter. (Ex: I am a first year and it is fall quarter.)",
      sender: "Metis",
      direction: "incoming"
    }
  ])

  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [prereqData, setPrereqData] = useState([]);  // Store prereq data globally


  //const ollama = new Ollama({ host: 'http://127.0.0.1:11434' })

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }
    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setTyping(true);

    // Send the user's message to Ollama and get a response
    const response = await answer(newMessage.message);
    console.log(response.message.content);
    /* const response = await ollama.chat({
      model: 'llama3.2',
      messages: [{role:'system', content:"I am an imaginary person named Metis, acting as a helper, like an advisor, for UCR BCOE students."}, { role: 'user', content: newMessage.message }],
    }); */


    // Assuming response worked
    const botMessage = {
      message: response.message.content,
      sender: "Metis",
      direction: "incoming"
    };

    // Append the bot's response to the messages
    setMessages((prevMessages) => [...prevMessages, botMessage]);
    setTyping(false);
    
  };

  const handleShowModal = (course) => {
    console.log("Opening modal with course data:", course);
    setSelectedCourse(course);
    setShowModal(true);
  };


  return (
    <div className={styles.main}>
        <div className={styles.visualizationPage}>

            <div className={styles.header}>
                <button className={styles.sideBarButton} onClick={toggleChat}><img src={sidebarIcon} alt='sidebar icon'className={styles.sidebarIcon}/></button>
                <span className={styles.Metis}>Metis</span>
                <img src={logo} alt='Metis Logo' className={styles.logoImage}/>
                <Link to="/"><button className={styles.logout}>Logout</button></Link>
            </div>

            <div className={`${styles.sideBar} ${chatVisible ? styles.sideBarOpen : styles.sideBarClosed}`}>
              <MainContainer>
                <ChatContainer>
                  <MessageList typingIndicator={typing ? <TypingIndicator content="Metis is typing" /> : null}>
                      {messages.map((message, i) => {
                        return <Message key={i} model={message}/>
                      })}
                  </MessageList>
                  <MessageInput placeholder='Type message here' onSend={handleSend}/>
                </ChatContainer>
              </MainContainer>

            </div>
            
            <div className='content'>
              <CourseTree 
                onNodeRightClick={handleShowModal} 
                setPrereqData={setPrereqData} 
                prereqData={prereqData} 
                currentUserId={currentUserId}
                completedCourses={completedCourses}
                />
            </div>
        </div>
        <Modal className={styles.courseModal} show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedCourse?.courseID || "Course Details"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Title:</strong> {selectedCourse?.title}</p>
            <p><strong>Units:</strong> {selectedCourse?.units}</p>
            <p><strong>Description:</strong> {selectedCourse?.description}</p>
            <p><strong>Prerequisites:</strong> {selectedCourse?.PREREQS 
              ? selectedCourse.PREREQS.map(prereq => 
                  prereq.courses.map(course => {
                    return course.prereqName || "Unknown Course";
                  }).join(" OR ")
                ).join(" AND ")
              : "None"}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
    </div>
  )
}

export default Visualization
