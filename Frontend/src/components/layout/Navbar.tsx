// src/components/layout/Navbar.tsx

import { useState } from 'react';
import { 
  Home, 
  Stethoscope, 
  User, 
  CalendarDays, 
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { Button } from '../common';

interface NavbarProps {
  userRole?: 'patient' | 'doctor' | null;
  isLoggedIn?: boolean;
  userImage?: string;
}

const Navbar = ({ 
  userRole = null, 
  isLoggedIn = false, 
  userImage = 'https://ui-avatars.com/api/?name=John+Doe&background=10b981&color=fff&size=40' 
}: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Doctors', href: '/doctors', icon: Stethoscope, show: userRole === 'patient' || !userRole },
    { name: 'Patients', href: '/patients', icon: User, show: userRole === 'doctor' },
    { name: 'Appointments', href: '/appointments', icon: CalendarDays, show: true },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-emerald-100 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Home className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-emerald-800 tracking-tight">
              Medi<span className="text-emerald-600">Care</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1 lg:gap-3 flex-1 justify-center">
            {navLinks.map((link) => {
              if (link.show === false) return null;
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-5 py-3 rounded-lg text-xl font-medium text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 transition-all duration-200 flex items-center gap-2"
                >
                  <Icon className="w-5 h-5" />
                  {link.name}
                </a>
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
                    className="w-12 h-12 rounded-full border-2 border-emerald-500 object-cover hover:border-emerald-700 transition-all"
                  />
                  <span className="text-xl font-medium text-emerald-800">John</span>
                  <ChevronDown className="w-5 h-5 text-emerald-600" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-emerald-100 py-1 z-50">
                    <a href="/profile" className="block px-4 py-2 text-lg text-emerald-700 hover:bg-emerald-50">
                      👤 Profile
                    </a>
                    <a href="/settings" className="block px-4 py-2 text-lg text-emerald-700 hover:bg-emerald-50">
                      ⚙️ Settings
                    </a>
                    <hr className="my-1 border-emerald-100" />
                    <button className="w-full text-left px-4 py-2 text-lg text-red-600 hover:bg-red-50">
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button variant="ghost" size="md" icon={User}>
                  Login
                </Button>
                <Button variant="primary" size="md" icon={CalendarDays}>
                  Register
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-emerald-700 hover:bg-emerald-50"
            >
              {isMobileMenuOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-emerald-100 py-2 px-4">
          {navLinks.map((link) => {
            if (link.show === false) return null;
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-3 rounded-lg text-xl font-medium text-emerald-700 hover:bg-emerald-50 transition-all flex items-center gap-3"
              >
                <Icon className="w-6 h-6" />
                {link.name}
              </a>
            );
          })}
          
          <hr className="my-2 border-emerald-100" />
          
          {isLoggedIn ? (
            <div className="flex items-center gap-3 px-3 py-3">
              <img
                src={userImage}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-emerald-500"
              />
              <span className="text-base font-medium text-emerald-800">John Doe</span>
              <button className="ml-auto text-base text-red-600 hover:text-red-800">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 px-3 py-2">
              <Button variant="ghost" fullWidth>
                Login
              </Button>
              <Button variant="primary" fullWidth>
                Register
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;