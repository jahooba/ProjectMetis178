import logo from '../assets/homepageAssets/logo.png'
import sidebarIcon from '../assets/visualizationAssets/sidebar-icon.png'

import './Visualization.css'

const Visualization = () => {
  return (
    <div>
        <div className="visualization-page">

            <div className='header'>
                <img src={sidebarIcon} alt='sidebar icon' className='sidebar-icon'/>
                <span className='Metis'>Metis</span>
                <img src={logo} alt='Metis Logo' className='logoImage'/>
                <button className='logout'>Logout</button>
            </div>

            <div className='courses'>
                <p>Courses</p>
            </div>

        </div>
    </div>
  )
}

export default Visualization
