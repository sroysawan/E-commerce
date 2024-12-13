import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useEcomStore from "../../store/ecom-store";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const user = useEcomStore((state) => state.user);
  useEffect(() => {
    // หากผู้ใช้ล็อกอินแล้ว ให้ redirect ไปหน้าอื่น
    if (user) {
      navigate("/user"); // หรือหน้าอื่นที่คุณต้องการให้ผู้ใช้ที่ล็อกอินเข้าไป
    }
  }, [user, navigate]);

  const handleOnchange = (e) => {
    // console.log(e.target.name, e.target.value);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return alert("Confirm Password is not match");
    }
    // console.log(form);

    //Send to Back
    try {
      const res = await axios.post("http://localhost:5000/api/register", form);
      // console.log(res);
      // navigate('/login')
      toast.success(res.data, {
        onClose: () => navigate("/login", { state: { fromRegister: true } }), // ส่ง state ไปยังหน้า Login
      });
    } catch (error) {
      const errMsg = error.response?.data?.message;
      toast.error(errMsg);
      // console.log(error)
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 ">
      <div className="mx-auto max-w-lg">
        <form
          onSubmit={handleSubmit}
          className="mb-0 mt-6 space-y-4 rounded-lg p-4 border shadow-2xl sm:p-6 lg:p-8"
        >
          <p className="text-center text-lg font-medium">Register</p>

          <div className="relative">
            <input
              type="text"
              name="name"
              className="w-full rounded-lg p-4 pe-12 text-sm shadow-sm shadow-black"
              placeholder="Enter Username"
              onChange={handleOnchange}
            />
          </div>
          <div className="relative">
            <input
              type="email"
              name="email"
              className="w-full rounded-lg p-4 pe-12 text-sm shadow-sm shadow-black"
              placeholder="Enter email"
              onChange={handleOnchange}
            />

            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </span>
          </div>

          <div>
            <div className="relative">
              <input
                type="text"
                name="password"
                className="w-full rounded-lg p-4 pe-12 text-sm shadow-sm shadow-black"
                placeholder="Enter password"
                onChange={handleOnchange}
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <input
                type="text"
                name="confirmPassword"
                className="w-full rounded-lg p-4 pe-12 text-sm shadow-sm shadow-black"
                placeholder="Confirm password"
                onChange={handleOnchange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
