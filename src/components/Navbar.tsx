import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import logo1 from "../assets/react.svg";


export default function Navbar() {

  const [show, setShow] = useState(true); // Navbar visible
  const [lastScrollY, setLastScrollY] = useState(0); // Last scroll position

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        // Scrolling down
        setShow(false);
      } else {
        // Scrolling up
        setShow(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <nav
        className={`
        fixed top-2 left-1/2 transform -translate-x-1/2
        z-100 
        px-0 pl-3  py-0
        max-w-4xl w-[90%]
        bg-white/25 border border-white/20
        backdrop-blur-2xl
        rounded-full shadow-md shadow-[#3a3a3a] 
        transition-all duration-500 ease-in-out 
        ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}
      `}
      >
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center h-16 ml-3">
            <Link to="/">
              <img src={logo1} alt="logo" className="h-12 w-auto" />
            </Link>
          </div>

          {/* Navigation Links for Desktop*/}

          <div className="hidden sm:flex gap-10 mr-5">

            <NavLink
              to="/Services"
              className=" flex items-center px-2 py-2 text-black font-bold text-lg hover:text-[#F3F4F6] transition-all hover:scale-110 duration-300"
            >
              Services
            </NavLink>

            <NavLink
              to="/Signup"
              className=" flex items-center px-2 py-2 text-black font-bold text-lg hover:text-[#F3F4F6] transition-all hover:scale-110 duration-300"
            >
              Sign Up
            </NavLink>

            <NavLink
              to="/Login"
              className=" flex items-center px-2 py-2 text-black font-bold text-lg hover:text-[#F3F4F6] transition-all hover:scale-110 duration-300"
            >
              Log In
            </NavLink>
          </div>

        </div>
      </nav>

    </>
  );
}
