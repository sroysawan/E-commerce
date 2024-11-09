import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
const App = () => {
  //JavaScript
  return (
    //html
    <>
      <ToastContainer pauseOnFocusLoss={false} newestOnTop autoClose={2000} />
      <AppRoutes />
    </>
  );
};

export default App;
