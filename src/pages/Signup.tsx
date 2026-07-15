import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { signup } from "../api/DataServices";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    weight: "",
    height: "",
    weightGoal: "",
  });
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await signup(
      form.name,
      form.email,
      form.password,
      Number(form.age),
      Number(form.weight),
      Number(form.height),
      Number(form.weightGoal)
    );

    if (res.errors) {
      setMessage(res.errors.join(", "));
    } else if (res.error) {
      setMessage(res.error);
    } else {
      localStorage.setItem("JWT", res.JWT)
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
        <div className="p-15 mx-5 mt-10 w-150  bg-neutral-200 rounded-2xl shadow-xl shadow-gray-900 flex items-start justify-start flex-col">
          <p className="text-gray-800 text-3xl font-semibold items-start justify-start">
            Sign Up
          </p>
          <p className="text-gray-500 text-m font-semibold items-start justify-start mt-1">
            Welcome ! Create a new account
          </p>

          {/* Name */}

          <p className="text-gray-800 text-xl font-semibold items-start justify-start mt-5">
            Name
          </p>

          <input className=  "text-black mt-2 w-full px-4 py-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition duration-200 ease-in-out" 
            placeholder=""
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          {/* email */}
          <p className="text-gray-800 text-xl font-semibold items-start justify-start mt-5">
            Email
          </p>

          <input
            className="text-black mt-2 w-full px-4 py-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition duration-200 ease-in-out"
            placeholder=""
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {/* Password */}

          <p className="text-gray-800 text-xl font-semibold items-start justify-start mt-5">
            Password
          </p>

          <input
            className=" text-black mt-2 w-full px-4 py-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition duration-200 ease-in-out"
            placeholder=""
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          
          {/* Sign In Button */}
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-neutral-200 font-bold text-xl rounded-md shadow-md hover:shadow-lg shadow-blue-500 py-4 px-6 mt-6 transition duration-200 ease-in-out"
            type="submit"
          >
            Sign Up
          </button>

          <div className="flex  justify-center w-full gap-2 mt-3">
            <p className="text-gray-500 text-lg font-semibold items-start justify-start ">
              Already have an account?
            </p>
            <Link
              to="/login"
              className="text-blue-800 text-lg font-semibold items-start justify-start "
            >
              Log In
            </Link>
          </div>
        </div>
      </form>
    </div>
  );

  // return (
  //   <form onSubmit={handleSubmit}>
  //     {/* Input fields */}
  //     <input placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
  //     <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
  //     <input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
  //     <input placeholder="Age" onChange={(e) => setForm({ ...form, age: e.target.value })} />
  //     <input placeholder="Weight" onChange={(e) => setForm({ ...form, weight: e.target.value })} />
  //     <input placeholder="Height" onChange={(e) => setForm({ ...form, height: e.target.value })} />
  //     <input placeholder="Weight Goal" onChange={(e) => setForm({ ...form, weightGoal: e.target.value })} />
  //     <button type="submit">Sign Up</button>
  //     <p>{message}</p>
  //   </form>
  // );
}
