import './components/Homepage/Homepage'
import Homepage from './components/Homepage/Homepage'
import './components/Login/Login'
import Login from './components/Login/Login'
import './components/Signup/Signup'
import Signup from './components/Signup/Signup'
import './components/Visualization/Visualization'
import Visualization from './components/Visualization/Visualization'

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
      <RouterProvider router={router} />
    </>
  )
}

export default App
