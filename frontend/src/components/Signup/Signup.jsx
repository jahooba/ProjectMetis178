import logo from '../../assets/homepageAssets/logo.png';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';

import styles from './Signup.module.css'
import axios from 'axios';

const Signup = () => {
    const navigate = useNavigate();

    const [data, setData] = useState({
        email: '',
        password: '',
    })

    const registerUser = async (e) => {
        e.preventDefault();
        const { email, password } = data;
    
        try {
            const response = await axios.post('/signup', { email, password });
            if (response.data.error) {
                toast.error(response.data.error); // Display error from backend
            } 
            
            else {
                setData({ email: '', password: '' });
                toast.success('Signup successful!');
                navigate('/visual'); // Redirect after successful login
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.error || 'An error occurred');
                console.log(error.response.data);
            } 
            
            else {
                console.error(error);
            }
        }
    };

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

                <form onSubmit={registerUser} noValidate>
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

                <div className={styles.login}> 
                    <span className={styles.loginText}>Need to </span>
                        {/* add link to signup page */}
                        <Link to="/login" className={styles.loginLink}>Login</Link>
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