import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useEcomStore from "../../store/ecom-store";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ใช้ location เพื่อเข้าถึง state

  const actionLogin = useEcomStore((state) => state.actionLogin);
  const user = useEcomStore((state) => state.user);
  // console.log("user from zustand", user);

  // useEffect(() => {
  //   // หากผู้ใช้ล็อกอินแล้ว ให้ redirect ไปหน้าอื่น
  //   if (user) {
  //     navigate("/user"); // หรือหน้าอื่นที่คุณต้องการให้ผู้ใช้ที่ล็อกอินเข้าไป
  //   }
  // }, [user, navigate]);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleOnchange = (e) => {
    // console.log(e.target.name,e.target.value)
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await actionLogin(form);
      // console.log("res", res);

      const role = res.data.payload.role;
      // ตรวจสอบว่ามาจากหน้า Register หรือไม่
      if (location.state?.fromRegister) {
        navigate('/'); // นำไปยัง Dashboard หรือหน้าที่ต้องการ
      } else {
        roleRedirect(role); // นำไปยังหน้าที่เหมาะสมตาม role
      }

      toast.success("Welcome Back");
    } catch (error) {
      const errMsg = error.response?.data?.message;
      toast.error(errMsg);
    }
  };

  const roleRedirect = (role) => {
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate(-1);
      // navigate('/user')
    }
  };

  return (
    <div className="px-10 py-16 mx-auto md:mx-auto md:max-w-screen-xl lg:px-8">
      <div className="mx-auto max-w-lg">
        <form
          onSubmit={handleSubmit}
          className="mb-0 mt-6 space-y-4 rounded-lg p-4 border shadow-2xl sm:p-6 lg:p-8"
        >
          <p className="text-center text-lg font-medium">
            Sign in to your account
          </p>

          <div>
            <div className="relative">
              <input
                type="email"
                name="email"
                autoComplete="off"
                className="w-full rounded-lg p-4 pe-12 border focus:outline-none 
                focus:ring-2 focus:ring-blue-700"
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
          </div>

          <div>
            <div className="relative">
              <input
                type="password"
                name="password"
                autoComplete="off"
                className="w-full rounded-lg p-4 pe-12 border focus:outline-none 
                focus:ring-2 focus:ring-blue-700"
                placeholder="Enter password"
                onChange={handleOnchange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="block w-full rounded-lg bg-indigo-600 hover:bg-indigo-800 px-5 py-3 text-sm font-medium text-white"
          >
            Sign in
          </button>

          <p className="text-center text-sm text-gray-500 ">
            No account?{" "}
            <Link to={"/register"} className="underline hover:text-gray-700">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
