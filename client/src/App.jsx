import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  //JavaScript



  return (
    //html
  <>
    <ToastContainer pauseOnFocusLoss={false}/>
    <AppRoutes />
  </>
  )
}

export default App
