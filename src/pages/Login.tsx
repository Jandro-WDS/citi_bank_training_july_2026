import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { login } from "../api/DataServices";

import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await login(form.email, form.password);

    if (res.errors) {
      setMessage(res.errors.join(", "));
    } else if (res.error) {
      setMessage(res.error);
    } else {
      localStorage.setItem("JWT", res.JWT); //accesed as localStorage.getItem("JWT")
      setMessage("Signup successful!");
      navigate("/dashboard");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 via-purple-900 to-red-900">
      {/* Back Button */}
      <Link
        to="/"
        className=" ml-10 mt-6 absolute top-4 left-4 text-neutral-200 hover:text-neutral-400 font-medium"
      >
        <div className="flex items-center  font-bold">
          <ChevronLeft className="w-8 h-8 text-primary mr-1" /> Back to Home
        </div>
      </Link>

      {/* Login form */}
      <form onSubmit={handleSubmit}>
        <div className="p-15 mx-5 mt-10 w-150 bg-neutral-200 rounded-2xl shadow-xl shadow-gray-900 flex items-start justify-start flex-col">
          <p className="text-gray-800 text-3xl font-semibold items-start justify-start">
            Login
          </p>
          <p className="text-gray-500 text-m font-semibold items-start justify-start mt-1">
            Welcome back! Please enter your credentials.
          </p>
          <p className="text-gray-800 text-xl font-semibold items-start justify-start mt-5">
            Email
          </p>
          <input
            className="text-black mt-2 w-full px-4 py-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition duration-200 ease-in-out"
            placeholder=""
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <div className="flex justify-between items-center w-full">
            <p className="text-gray-800 text-xl font-semibold items-start justify-start mt-5">
              Password
            </p>
            <p className="text-blue-800 text-md font-semibold items-start justify-start mt-5">
              Forgot Password?
            </p>
          </div>

          <input
            className=" text-black mt-2 w-full px-4 py-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition duration-200 ease-in-out"
            placeholder=""
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <div className="flex gap-3 items-center mt-3">
            <input
              type="checkbox"
              className="w-5 h-5 appearance-none border border-gray-300 bg-gray-100  rounded  checked:bg-blue-600 checked:border-blue-600 cursor-pointer"
            />
            <p className="text-gray-500 text-lg font-semibold items-start justify-start mt-1">
              Remember me
            </p>
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-neutral-200 font-bold text-xl rounded-md shadow-md hover:shadow-lg shadow-blue-500 py-4 px-6 mt-6 transition duration-200 ease-in-out"
            type="submit"
          >
            Sign In
          </button>

          <div className="flex  justify-center w-full gap-2 mt-3">
            <p className="text-gray-500 text-lg font-semibold items-start justify-start ">
              Don't have an account?
            </p>
            <Link
              to="/signin"
              className="text-blue-800 text-lg font-semibold items-start justify-start "
            >
              Sign up
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
