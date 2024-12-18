import logo from '../assets/homepageAssets/logo.png'
import computer from '../assets/homepageAssets/computer.png'
import pinkTree from '../assets/homepageAssets/pink-tree.png'

import './Homepage.css'

const Homepage = () => {
  return (
    <div>

    <div className="homepage">

        <div className="leftSection">

            <div className="welcomeSection">
                <div className="welcomeLeftSection">
                    <h1 className='mainWelcomeText'>Welcome to <span className="metis">Metis</span></h1>
                    <p className='subWelcomeText'>A tool to assist you in exploring courses at UCR.</p>
                </div>

                {/* Add Link back to homepage when logo is clicked */}
                <div className="logo">
                        <img src={logo} alt="Logo Icon" className='logoImage'/>
                    </div>

            </div>

            <div className="middleSection">

                <div className="middleTopSection">
                    <div className="computer">
                        <img src={computer} alt="Computer Icon" className='computerImage'/>
                    </div>
                    <p>Chat with Metis to learn more about course paths and information.</p>
                </div>

                <div className="middleBottomSection">
                <div className="computer">
                        <img src={pinkTree} alt="Pink Tree Icon" className='pinkTreeImage'/>
                    </div>
                    <p>Search through the UCR course database and select courses to plan and learn more about them.</p>
                </div>

            </div>

            <div className="bottomSection">
                <button className='beginButton'>Get started</button>
                <p className='footer'>Powered by Ollama, etc.</p>
            </div>
        </div>


        <div className="rightSection">
            <div className="headerSection">
                <button className="signUp">Sign Up</button>
                <button className="login">Login</button>
            </div>
        </div>
    </div>
    
    </div>
  )
}

export default Homepage
