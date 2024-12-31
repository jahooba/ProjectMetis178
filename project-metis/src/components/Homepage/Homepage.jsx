import logo from '../../assets/homepageAssets/logo.png';
import computer from '../../assets/homepageAssets/computer.png';
import pinkTree from '../../assets/homepageAssets/pink-tree.png';
import { Link } from 'react-router-dom';

import styles from './Homepage.module.css'

const Homepage = () => {
  return (
    <div className={styles.main}>

    <div className={styles.homepage}>

        <div className={styles.leftSection}>

            <div className={styles.welcomeSection}>
                <div className={styles.welcomeLeftSection}>
                    <h1 className={styles.mainWelcomeText}>Welcome to <span className={styles.metis}>Metis</span></h1>
                    <p className={styles.subWelcomeText}>A tool to assist you in exploring courses at UCR.</p>
                </div>

                {/* Add Link back to homepage when logo is clicked */}
                <div className={styles.logo}>
                    <Link to="/"><img src={logo} alt="Logo Icon" className={styles.logoImage}/></Link>
                    </div>

            </div>

            <div className={styles.middleSection}>

                <div className={styles.middleTopSection}>
                    <div className="computer">
                        <img src={computer} alt="Computer Icon" className={styles.computerImage}/>
                    </div>
                    <p>Chat with Metis to learn more about course paths and information.</p>
                </div>

                <div className={styles.middleBottomSection}>
                <div className="computer">
                        <img src={pinkTree} alt="Pink Tree Icon" className={styles.pinkTreeImage}/>
                    </div>
                    <p>Search through the UCR course database and select courses to plan and learn more about them.</p>
                </div>

            </div>

            <div className={styles.bottomSection}>
                <Link to="/signup"><button className={styles.beginButton}>Get started</button></Link>
                <p className={styles.footer}>Powered by Ollama, etc.</p>
            </div>
        </div>


        <div className={styles.rightSection}>
            <div className={styles.headerSection}>
                <Link to="/signup"><button className={styles.signUp}>Sign Up</button></Link>
                <Link to="/login"><button className={styles.login}>Login</button></Link>
            </div>
        </div>
    </div>
    
    </div>
  )
}

export default Homepage
