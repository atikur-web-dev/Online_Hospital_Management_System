// src/components/layout/Navbar.tsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Stethoscope,
  User,
  CalendarDays,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "../common";

interface NavbarProps {
  userRole?: string | null;
  isLoggedIn?: boolean;
  userImage?: string;
}

const Navbar = ({
  userRole = null,
  isLoggedIn = false,
  userImage = "https://ui-avatars.com/api/?name=John+Doe&background=10b981&color=fff&size=40",
}: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const visitorLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Doctors", path: "/doctors", icon: Stethoscope },
  ];

  const patientLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Doctors", path: "/doctors", icon: Stethoscope },
    {
      name: "Appointments",
      path: "/appointments",
      icon: CalendarDays,
    },
  ];

  const doctorLinks = [
    { name: "Dashboard", path: "/doctor/dashboard", icon: Home },
    {
      name: "Appointments",
      path: "/doctor/appointments",
      icon: CalendarDays,
    },
  ];

  const adminLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: Home },
    { name: "Doctors", path: "/admin/doctors", icon: Stethoscope },
  ];
  let navLinks = visitorLinks;

  if (isLoggedIn) {
    switch (userRole?.toUpperCase()) {
      case "PATIENT":
        navLinks = patientLinks;
        break;

      case "DOCTOR":
        navLinks = doctorLinks;
        break;

      case "ADMIN":
        navLinks = adminLinks;
        break;

      default:
        navLinks = visitorLinks;
    }
  }

  const handleNavigation = (path: string) => {
    if (!isLoggedIn && path !== "/") {
      navigate("/login");
      return;
    }
    navigate(path);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-emerald-100 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-26">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Home className="w-10 h-10 text-white" />
            </div>
            <span className="text-4xl font-bold text-emerald-800 tracking-tight">
              Care<span className="text-emerald-600">Plus</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 lg:gap-2 flex-1 justify-center">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavigation(link.path)}
                  className="px-4 py-2 rounded-lg text-9xl font-bold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 transition-all duration-200 flex items-center gap-2"
                >
                  <Icon className="w-8 h-8" />
                  {link.name}
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-full"
                >
                  <img
                    src={userImage}
                    alt="Profile"
                    className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500"
                  />

                  <span className="text-xl font-semibold text-emerald-800 max-w-[140px] truncate">
                    {localStorage.getItem("name") ?? "User"}
                  </span>
                  <ChevronDown className="w-8 h-8 text-emerald-600" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-emerald-100 py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-4xl text-emerald-700 hover:bg-emerald-50"
                    >
                      Profile
                    </Link>
                    {/* <Link
                      to="/settings"
                      className="block px-4 py-3 text-4xl text-emerald-700 hover:bg-emerald-50"
                    >
                      Settings
                    </Link> */}
                    <hr className="my-1 border-emerald-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-4xl text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="lg" icon={User}>
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="lg" icon={CalendarDays}>
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-emerald-700 hover:bg-emerald-50"
            >
              {isMobileMenuOpen ? (
                <X className="w-10 h-10" />
              ) : (
                <Menu className="w-10 h-10" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-emerald-100 py-2 px-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.name}
                onClick={() => {
                  handleNavigation(link.path);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-3 rounded-lg text-4xl font-medium text-emerald-700 hover:bg-emerald-50 transition-all flex items-center gap-3"
              >
                <Icon className="w-8 h-8" /> {link.name}
              </button>
            );
          })}

          <hr className="my-2 border-emerald-100" />

          {isLoggedIn ? (
            <div className="flex items-center gap-3 px-3 py-2">
              <img
                src={userImage}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-emerald-500"
              />
              <span className="text-lg font-semibold text-emerald-800 truncate">
                {localStorage.getItem("name") ?? "User"}
              </span>
              <button
                onClick={handleLogout}
                className="ml-auto text-3xl text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 px-3 py-2">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" fullWidth size="lg">
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" fullWidth size="lg">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
