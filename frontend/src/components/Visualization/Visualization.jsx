import logo from '../../assets/homepageAssets/logo.png';
import sidebarIcon from '../../assets/visualizationAssets/sidebar-icon.png'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react'
import { useState } from 'react';
//import ollama from 'ollama'
import { Ollama } from 'ollama'

import { Link } from 'react-router-dom';


import styles from './Visualization.module.css'

const Visualization = () => {
  const [chatVisible, setChatVisible] = useState(false);

  const toggleChat = () => {
    setChatVisible(!chatVisible);
  };

  const [typing, setTyping] = useState(false);

  const [messages, setMessages] = useState([
    {
      message: "Hello, I am Metis!!!",
      sender: "Metis",
      direction: "incoming"
    }
  ])

  const ollama = new Ollama({ host: 'http://127.0.0.1:11434' })

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }
    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setTyping(true);



    /* const response = await ollama.chat({
    model: 'llama3.2:1b',
    messages: [{ role: 'user', content: newMessage.message }],
    })

    console.log(response); //llama response */

    // Send the user's message to Ollama and get a response
    const response = await ollama.chat({
      model: 'llama3.2:1b',
      messages: [{ role: 'user', content: newMessage.message }],
    });


    // Assuming response contains a 'content' field with the bot's reply
    const botMessage = {
      message: response.message.content,
      sender: "Metis",
      direction: "incoming"
    };
    console.log("Response Content Type:", typeof response.message.content, response.message.content);

    // Append the bot's response to the messages
    console.log(response);
    setMessages((prevMessages) => [...prevMessages, botMessage]);
    setTyping(false);
    
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

        </div>
    </div>
  )
}

export default Visualization
