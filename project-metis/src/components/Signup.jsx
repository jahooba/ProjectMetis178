import logo from '../assets/homepageAssets/logo.png'

import './Signup.css'

const Signup = () => {
  return (
    <div>
    <div className="signup">

        <div className="header"> 
                <div className="Title">
                    <span className="metis">Metis</span>
                </div>
                <div className="logo">
                    {/* Add Link back to homepage when logo is clicked */}
                    <img src={logo} alt="Logo Icon" className='logoImage'/>
                </div>
        </div>
        
        <div className="signupbox">
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

                <div className='login'> 
                    <span className='loginText'>Need to </span>
                        {/* add link to signup page */}
                        <a href="" className='loginLink'>Login</a> 
                    <span className='loginText'> instead?</span>
                </div>
            </div>

            <hr />

            <div className='bottomSection'>
                <button>Signup with Google</button>
            </div>

        </div>
    </div>
    </div>
  )
}

export default Signup
