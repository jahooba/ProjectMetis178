import logo from '../../assets/homepageAssets/logo.png';
import sidebarIcon from '../../assets/visualizationAssets/sidebar-icon.png'

import { Link } from 'react-router-dom';


import styles from './Visualization.module.css'

const Visualization = () => {
  return (
    <div className={styles.main}>
        <div className={styles.visualizationPage}>

            <div className={styles.header}>
                <img src={sidebarIcon} alt='sidebar icon' className={styles.sidebarIcon}/>
                <span className={styles.Metis}>Metis</span>
                <img src={logo} alt='Metis Logo' className={styles.logoImage}/>
                <Link to="/login"><button className={styles.logout}>Logout</button></Link>
            </div>

            <div className={styles.courses}>
                <p>Courses</p>
            </div>

        </div>
    </div>
  )
}

export default Visualization
