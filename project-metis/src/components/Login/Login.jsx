import logo from '../../assets/homepageAssets/logo.png';
import { Link } from 'react-router-dom';

import styles from './Login.module.css'

const Login = () => {
  return (
    <div className={styles.main}>
    <div className={styles.login}>

        <div className={styles.header}>
                <div className={styles.Title}>
                    <span className={styles.metis}>Metis</span>
                </div>
                <div className={styles.logo}>
                    {/* Add Link back to homepage when logo is clicked */}
                    <Link to="/"><img src={logo} alt="Logo Icon" className={styles.logoImage}/></Link>
                </div>
        </div>
        
        <div className={styles.loginbox}>
            <div className={styles.topSection}>
                <h2>Login</h2>

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

                <div className={styles.signup}> 
                    <span className={styles.signupText}>Need to </span>
                        {/* add link to signup page */}
                        <Link to="/signup"><a href="" className={styles.signupLink}>Sign Up</a></Link>
                    <span className={styles.signupText}> instead?</span>
                </div>
            </div>

             <hr className={styles.line} />

            <div className={styles.bottomSection}>
                <button>Login with Google</button>
            </div>

        </div>
    </div>
    </div>
  )
}

export default Login
