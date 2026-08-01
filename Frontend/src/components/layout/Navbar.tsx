// src/components/layout/Navbar.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Stethoscope,
  User,
  CalendarDays,
  Menu,
  X,
  ChevronDown,
  Building2,
  Briefcase,
  Users,
  Phone,
  Heart,
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
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    setIsDropdownOpen(false);
  };

  // Visitor links
  const visitorLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Doctors", path: "/doctors", icon: Stethoscope },
    { name: "Departments", path: "/departments", icon: Building2 },
    { name: "Services", path: "/services", icon: Briefcase },
    { name: "About", path: "/about", icon: Users },
    
  ];

  // Logged-in user links
  const patientLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Doctors", path: "/doctors", icon: Stethoscope },
    { name: "Appointments", path: "/appointments", icon: CalendarDays },
  ];

  const doctorLinks = [
    { name: "Dashboard", path: "/doctor/dashboard", icon: Home },
    { name: "Appointments", path: "/doctor/appointments", icon: CalendarDays },
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

  const isActiveLink = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 p-2.5 rounded-xl shadow-lg shadow-emerald-200">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-emerald-800 tracking-tight">
              Care<span className="text-emerald-600">Plus</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActiveLink(link.path);
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavigation(link.path)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 relative group
                    ${active 
                      ? 'text-emerald-700 bg-emerald-50' 
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/50'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 transition-colors duration-200 ${active ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'}`} />
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-emerald-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Side - Auth Buttons */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isLoggedIn ? (
              <div className="relative dropdown-container">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-full p-1 hover:bg-emerald-50 transition-colors"
                >
                  <img
                    src={userImage}
                    alt="Profile"
                    className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500"
                  />
                  <span className="text-sm font-semibold text-emerald-800 max-w-[120px] truncate">
                    {localStorage.getItem("name") ?? "User"}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-emerald-600 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-emerald-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-emerald-700 hover:bg-emerald-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <hr className="my-1 border-emerald-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <span className="w-4 h-4 flex items-center justify-center">✕</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="md" icon={User}>
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="md" icon={CalendarDays}>
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-8 h-8" />
              ) : (
                <Menu className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-emerald-100 py-4 px-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActiveLink(link.path);
            return (
              <button
                key={link.name}
                onClick={() => handleNavigation(link.path)}
                className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all flex items-center gap-3 ${
                  active
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-emerald-50/50 hover:text-emerald-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-emerald-600' : 'text-gray-400'}`} />
                {link.name}
              </button>
            );
          })}

          <hr className="my-3 border-emerald-100" />

          {isLoggedIn ? (
            <div className="flex items-center gap-3 px-4 py-2">
              <img
                src={userImage}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-emerald-500"
              />
              <span className="text-base font-semibold text-emerald-800 truncate flex-1">
                {localStorage.getItem("name") ?? "User"}
              </span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 px-4 py-2">
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