import React, { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import useEcomStore from "../../store/ecom-store";
import { useNavigate } from "react-router-dom";




const Login = () => {
  const navigate = useNavigate()
  const actionLogin = useEcomStore((state)=>state.actionLogin)
  const user = useEcomStore((state)=>state.user)
  console.log('user from zustand',user)
  const [form,setForm] = useState({
    email:"",
    password:"",
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
    try {
      const res = await actionLogin(form)
      console.log('res',res)

      const role = res.data.payload.role
      roleRedirect(role)


      toast.success('Welcome Back')
    } catch (error) {
      const errMsg = error.response?.data?.message
      toast.error(errMsg)
    }
  }

  const roleRedirect = (role) => {
    if(role === 'admin'){
      navigate('/admin')
    }else{
      navigate(-1)
      // navigate('/user')
    }
  }

  return (
    <div className="text-center">
      <div className="">
      Login
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

          <button className="bg-blue-700 text-white rounded-lg">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
