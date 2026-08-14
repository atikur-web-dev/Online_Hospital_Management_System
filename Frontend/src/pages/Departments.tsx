// src/pages/Departments.tsx
import { Building2, Heart, Brain, Bone, Baby, Stethoscope, Eye, Ear, Activity, ArrowRight, Users, Clock, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/common";
import Footer from "../components/layout/Footer";


const Departments = () => {
  const departments = [
    { 
      name: "Cardiology", 
      icon: Heart, 
      description: "Comprehensive heart care and treatment", 
      doctors: 12,
      color: "from-red-500 to-red-400",
      bgColor: "bg-red-50",
      iconColor: "text-red-600"
    },
    { 
      name: "Neurology", 
      icon: Brain, 
      description: "Expert care for brain and nervous system", 
      doctors: 8,
      color: "from-purple-500 to-purple-400",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    { 
      name: "Orthopedics", 
      icon: Bone, 
      description: "Advanced bone and joint care", 
      doctors: 10,
      color: "from-blue-500 to-blue-400",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    { 
      name: "Pediatrics", 
      icon: Baby, 
      description: "Specialized care for children", 
      doctors: 9,
      color: "from-pink-500 to-pink-400",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600"
    },
    { 
      name: "Dermatology", 
      icon: Eye, 
      description: "Skin, hair, and nail treatments", 
      doctors: 6,
      color: "from-amber-500 to-amber-400",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600"
    },
    { 
      name: "ENT", 
      icon: Ear, 
      description: "Ear, nose, and throat specialists", 
      doctors: 5,
      color: "from-teal-500 to-teal-400",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600"
    },
    { 
      name: "Ophthalmology", 
      icon: Activity, 
      description: "Comprehensive eye care", 
      doctors: 7,
      color: "from-indigo-500 to-indigo-400",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600"
    },
    { 
      name: "Gynecology", 
      icon: Stethoscope, 
      description: "Women's health and wellness", 
      doctors: 8,
      color: "from-rose-500 to-rose-400",
      bgColor: "bg-rose-50",
      iconColor: "text-rose-600"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <section className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(5, 60, 50, 0.88), rgba(5, 60, 50, 0.78)),
              url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
            backgroundPosition: "center 40%",
          }}
        />

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="text-center text-white">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
                <Building2 size={52} className="text-emerald-300" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              Our Departments
            </h1>
            
            <p className="text-lg md:text-xl text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
              World-class medical departments staffed by experienced specialists 
              dedicated to your health and well-being
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Users size={16} className="text-emerald-300" />
                <span className="text-sm text-emerald-100">50+ Specialists</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Clock size={16} className="text-emerald-300" />
                <span className="text-sm text-emerald-100">24/7 Available</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Award size={16} className="text-emerald-300" />
                <span className="text-sm text-emerald-100">Top Rated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB" />
          </svg>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <div 
                key={dept.name} 
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100"
              >
                {/* Colored Top Bar */}
                <div className={`h-1.5 bg-linear-to-r ${dept.color}`} />
                
                <div className="p-6">
                  {/* Icon with Gradient Background */}
                  <div className={`inline-flex p-3 ${dept.bgColor} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${dept.iconColor}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-700 transition-colors">
                    {dept.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {dept.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-emerald-600" />
                      <span className="text-sm font-semibold text-gray-700">
                        {dept.doctors} Specialists
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600">
                      <span className="text-sm font-medium">Available</span>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    </div>
                  </div>
                  
                  {/* Pass department as query parameter */}
                  <Link to={`/doctors?department=${encodeURIComponent(dept.name)}`}>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      icon={ArrowRight} 
                      iconPosition="right" 
                      className="w-full justify-center group-hover:shadow-lg transition-all"
                    >
                      View Doctors
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-linear-to-r from-emerald-700 to-emerald-600 rounded-3xl p-10 md:p-14 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
          </div>
          
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Need Specialized Care?
            </h2>
            <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
              Our expert team is ready to provide you with world-class medical care 
              tailored to your needs
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/doctors">
                <Button variant="white" size="lg" icon={Users}>
                  Find a Specialist
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="ghost" size="lg" className="text-white hover:bg-white/20">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
          <Footer />
    </div>
  );
};

export default Departments;