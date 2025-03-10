import logo from '../../assets/homepageAssets/logo.png';
import { Link } from 'react-router-dom';
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

import styles from './Login.module.css'

const Login = () => {
    const navigate = useNavigate();
    const { updateUser } = useContext(UserContext);

    const [data, setData] = useState({
        email: '',
        password: '',
    })

    const loginUser = async (e) => {
        e.preventDefault()
        const {email, password} = data;

        try {
            const response = await axios.post('/login', { email, password });
            if (response.data.error) {
                toast.error(response.data.error); // Display error from backend
            } 
            
            else {
                console.log("Login Response Data: ", response.data);
                updateUser(response.data);
                setData({ email: '', password: '' });
                toast.success('Login successful!');
                navigate('/visual'); // Redirect after successful login
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.error || 'An error occurred');
                console.log(error.response.data);
            } 
            
            else {
                console.error(error);
                toast.error('An unexpected error occurred.');
            }
        }
    }

  return (
    <div className={styles.main}>
    <div className={styles.login}>

        <div className={styles.header}>
                <div className={styles.Title}>
                    <span className={styles.metis}>Metis</span>
                </div>
                <div className={styles.logo}>
                    <Link to="/"><img src={logo} alt="Logo Icon" className={styles.logoImage}/></Link>
                </div>
        </div>
        
        <div className={styles.loginbox}>
            <div className={styles.topSection}>
                <h2>Login</h2>

                <form onSubmit={loginUser}>
                    <div className={styles.inputs}>
                        <div className={styles.uInput}>
                            <label htmlFor="email">Email:</label>
                            <input type="email" id='email' name='email' required value={data.email} onChange={(e) => setData({...data, email: e.target.value})}/>
                        </div>

                        <div className={styles.uInput}>
                            <label htmlFor="password">Password:</label>
                            <input type="password" id='password' name='password' required value={data.password} onChange={(e) => setData({...data, password: e.target.value})}/>
                        </div>
                    </div>

                    <div className={styles.buttonSection}><button className={styles.submit} type='submit'>Submit</button></div>
                </form>

                <div className={styles.signup}> 
                    <span className={styles.signupText}>Need to </span>
                    <Link to="/signup" className={styles.signupLink}>Sign Up</Link>
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
