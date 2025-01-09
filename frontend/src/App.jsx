import './components/Homepage/Homepage'
import Homepage from './components/Homepage/Homepage'
import './components/Login/Login'
import Login from './components/Login/Login'
import './components/Signup/Signup'
import Signup from './components/Signup/Signup'
import './components/Visualization/Visualization'
import Visualization from './components/Visualization/Visualization'
import axios from 'axios'
import { Toaster } from 'react-hot-toast'

axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.withCredentials = true

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  { path: "/", element: <Homepage /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/visual", element: <Visualization /> },
]);

function App() {

  return (
    <>
      <Toaster position='bottom-right' toastOptions={{duration: 3000}}/>
      <RouterProvider router={router} />
    </>
  )
}

export default App
