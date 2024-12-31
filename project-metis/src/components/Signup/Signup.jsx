import logo from '../../assets/homepageAssets/logo.png';
import { Link } from 'react-router-dom';

import styles from './Signup.module.css'

const Signup = () => {
  return (
    <div className={styles.main}>
    <div className={styles.signup}>

        <div className={styles.header}> 
                <div className={styles.Title}>
                    <span className={styles.metis}>Metis</span>
                </div>
                <div className={styles.logo}>
                    {/* Add Link back to homepage when logo is clicked */}
                    <Link to="/"><img src={logo} alt="Logo Icon" className={styles.logoImage}/></Link>
                </div>
        </div>
        
        <div className={styles.signupbox}>
            <div className={styles.topSection}>
                <h2>Sign Up</h2>

                <div className={styles.inputs}>
                    <div className={styles.uInput}>
                        <label htmlFor="username">Username:</label>
                        <input type="text" id='username' name='username' required/>
                    </div>

                    <div className={styles.uInput}>
                        <label htmlFor="password">Password:</label>
                        <input type="password" id='password' name='password' required/>
                    </div>
                </div>

                <div className={styles.login}> 
                    <span className={styles.loginText}>Need to </span>
                        {/* add link to signup page */}
                        <Link to="/login"><a href="" className={styles.loginLink}>Login</a></Link>
                    <span className={styles.loginText}> instead?</span>
                </div>
            </div>

            <hr className={styles.line} />

            <div className={styles.bottomSection}>
                <button>Sign in with Google</button>
            </div>

        </div>
    </div>
    </div>
  )
}

export default Signup
