import React, { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
const Register = () => {

  const [form,setForm] = useState({
    email:"",
    password:"",
    confirmPassword: "",
  })

  const handleOnchange =(e)=>{
    // console.log(e.target.name,e.target.value)
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    if(form.password !== form.confirmPassword){
      return alert('Confirm Password is not match')
    }
    console.log(form)

    //Send to Back
    try {
      const res = await axios.post('http://localhost:5000/api/register',form)
      toast.success(res.data)
      // console.log(res)
    } catch (error) {
      const errMsg = error.response?.data?.message
      toast.error(errMsg)
      // console.log(error)
    }
  }

  return (
    <div>
      Register
      <form onSubmit={handleSubmit}>
        Email
        <input
          type="email"
          name="email"
          className="border"
          onChange={handleOnchange}
          // placeholder="Email"
        />
        Password
        <input 
          type="text" 
          name="password" 
          className="border" 
          onChange={handleOnchange}
        />
        Confirm Password
        <input 
          type="text" 
          name="confirmPassword" 
          className="border" 
          onChange={handleOnchange}
        />
        <button className="bg-blue-700 text-white rounded-lg">Register</button>
      </form>
    </div>
  );
};

export default Register;
