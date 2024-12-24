import logo from '../assets/homepageAssets/logo.png'

import './Login.css'

const Login = () => {
  return (
    <div>
    <div className="login">

        <div className="header"> 
                <div className="Title">
                    <span className="metis">Metis</span>
                </div>
                <div className="logo">
                    {/* Add Link back to homepage when logo is clicked */}
                    <img src={logo} alt="Logo Icon" className='logoImage'/>
                </div>
        </div>
        
        <div className="loginbox">
            <div className='topSection'>
                <h2>Login</h2>

                <div className="inputs">
                    <div className='uInput'>
                        <label htmlFor="username">Username:</label>
                        <input type="text" id='username' name='username' required/>
                    </div>

                    <div className='uInput'>
                        <label htmlFor="password">Password:</label>
                        <input type="text" id='password' name='password' required/>
                    </div>
                </div>

                <div className='signup'> 
                    <span className='signupText'>Need to </span>
                        {/* add link to signup page */}
                        <a href="" className='signupLink'>Sign Up</a> 
                    <span className='signupText'> instead?</span>
                </div>
            </div>

            <hr />

            <div className='bottomSection'>
                <button>Login with Google</button>
            </div>

        </div>
    </div>
    </div>
  )
}

export default Login
