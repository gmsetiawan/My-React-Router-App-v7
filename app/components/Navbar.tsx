import { NavLink } from "react-router";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`container mx-auto fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/20 backdrop-blur-sm shadow-lg rounded-b-md"
          : "bg-transparent"
      }`}
    >
      <nav className="flex p-4 h-14 gap-4">
        <NavLink
          to="/"
          className={`transition-colors ${
            isScrolled ? "hover:text-blue-600" : "hover:text-red-200"
          }`}
          end
          viewTransition
        >
          {({ isActive }) => (
            <span
              className={
                isActive ? (isScrolled ? "text-blue-600" : "text-red-400") : ""
              }
            >
              Home
            </span>
          )}
        </NavLink>
        <NavLink
          to="/about"
          className={`transition-colors ${
            isScrolled ? "hover:text-blue-600" : "hover:text-red-200"
          }`}
          end
          viewTransition
        >
          {({ isActive }) => (
            <span
              className={
                isActive ? (isScrolled ? "text-blue-600" : "text-red-400") : ""
              }
            >
              About
            </span>
          )}
        </NavLink>
      </nav>
    </div>
  );
}
