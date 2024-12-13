import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useEcomStore from "../../store/ecom-store";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import zxcvbn from "zxcvbn";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "User Name is required" }) // ตรวจสอบว่าไม่เป็นค่าว่าง
      .min(5, { message: "User Name must be at least 5 characters long" }), // ตรวจสอบความยาวขั้นต่ำ 5 ตัว
    email: z.string().email({ message: "Invalid Email!!!" }),
    password: z.string().min(8, { message: "Password must 8 character!" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password is not match",
    path: ["confirmPassword"],
  });
const NewRegister = () => {
  const navigate = useNavigate();
  const user = useEcomStore((state) => state.user);
  const [passwordScore, setPasswordScore] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const validatePassword = () => {
    let password = watch().password;
    return zxcvbn(password ? password : "").score;
  };

  useEffect(() => {
    setPasswordScore(validatePassword());
  }, [watch().password]);

  useEffect(() => {
    // หากผู้ใช้ล็อกอินแล้ว ให้ redirect ไปหน้าอื่น
    if (user) {
      navigate("/user"); // หรือหน้าอื่นที่คุณต้องการให้ผู้ใช้ที่ล็อกอินเข้าไป
    }
  }, [user, navigate]);


  // console.log(passwordScore);
  const onSubmit = async (data) => {
    // const passwordScore = zxcvbn(data.password).score;
    // console.log(passwordScore);
    if (passwordScore <= 2) {
      toast.warning("Password is not strong");
      return
    }
    try {
      const res = await axios.post("http://localhost:5000/api/register", data);
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

  //สร้าง password strong color
  //   const dis = Array.from(Array(5))
  //   console.log(dis)

  return (
    <div className="px-10 py-16 mx-auto md:mx-auto md:max-w-screen-xl lg:px-8">
      <div className="mx-auto max-w-lg">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-0 mt-6 space-y-4 rounded-lg p-4 border shadow-2xl sm:p-6 lg:p-8"
        >
          <h1 className="text-center text-2xl font-medium">Register</h1>

          <div className="relative space-y-2">
            <input
              {...register("name")}
              //   className="w-full rounded-lg p-4 pe-12 text-sm shadow-sm shadow-black"
              className={`w-full rounded-lg p-4 pe-12 border focus:outline-none 
                focus:ring-2 focus:ring-blue-700
                focus:border-transparent
                ${errors.name && "border-red-500"}
                `}
              placeholder="Enter Username"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="relative space-y-2">
            <input
              {...register("email")}
              className={`w-full rounded-lg p-4 pe-12 border focus:outline-none 
                focus:ring-2 focus:ring-blue-700
                focus:border-transparent
                ${errors.email && "border-red-500"}
                `}
              placeholder="Enter Email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="relative space-y-2">
              <input
                {...register("password")}
                type="password"
                className={`w-full rounded-lg p-4 pe-12 border focus:outline-none 
                    focus:ring-2 focus:ring-blue-700
                    focus:border-transparent
                    ${errors.password && "border-red-500"}
                    `}
                placeholder="Enter Password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
              {watch().password?.length > 0 && (
                <div className="flex gap-3">
                  {Array.from(Array(5).keys()).map((item, index) => (
                    <span className="w-1/5" key={index}>
                      <div
                        className={`h-2 rounded-lg ${
                          passwordScore <= 2
                            ? "bg-red-300"
                            : passwordScore < 4
                            ? "bg-yellow-300"
                            : "bg-green-500"
                        }`}
                      ></div>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="relative space-y-2">
              <input
                {...register("confirmPassword")}
                type="password"
                className={`w-full rounded-lg p-4 pe-12 border focus:outline-none 
                    focus:ring-2 focus:ring-blue-700
                    focus:border-transparent
                    ${errors.confirmPassword && "border-red-500"}
                    `}
                placeholder="Enter confirmPassword"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="block w-full rounded-lg bg-indigo-600 hover:bg-indigo-800 px-5 py-3 text-sm font-medium text-white"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewRegister;
