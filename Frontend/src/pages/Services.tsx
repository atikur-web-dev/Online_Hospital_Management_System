// src/pages/Services.tsx
import { 
  Briefcase, 
  Ambulance, 
  Clipboard, 
  Pill, 
  Stethoscope, 
  Heart, 
  Activity, 
  UserCheck, 
  Clock, 
  Shield, 
  Award, 
  Phone,
  Users,
  Star,
  ArrowRight
} from "lucide-react";
import { Button } from "../components/common";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    { 
      icon: Ambulance, 
      name: "Emergency Care", 
      description: "24/7 emergency medical services with rapid response", 
      color: "from-red-500 to-red-400",
      bgColor: "bg-red-50",
      iconColor: "text-red-600"
    },
    { 
      icon: Clipboard, 
      name: "Health Checkups", 
      description: "Comprehensive preventive health screenings", 
      color: "from-blue-500 to-blue-400",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    { 
      icon: Pill, 
      name: "Pharmacy Services", 
      description: "Full-service pharmacy with prescription management", 
      color: "from-green-500 to-green-400",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    { 
      icon: Stethoscope, 
      name: "Specialist Consultations", 
      description: "Expert consultations across all specialties", 
      color: "from-purple-500 to-purple-400",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    { 
      icon: Heart, 
      name: "Cardiac Care", 
      description: "Advanced cardiac diagnostics and treatment", 
      color: "from-rose-500 to-rose-400",
      bgColor: "bg-rose-50",
      iconColor: "text-rose-600"
    },
    { 
      icon: Activity, 
      name: "Rehabilitation", 
      description: "Physical therapy and rehabilitation programs", 
      color: "from-amber-500 to-amber-400",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600"
    },
    { 
      icon: UserCheck, 
      name: "Mental Health", 
      description: "Comprehensive mental health and wellness support", 
      color: "from-teal-500 to-teal-400",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600"
    },
    { 
      icon: Clock, 
      name: "Telemedicine", 
      description: "Virtual consultations from the comfort of home", 
      color: "from-indigo-500 to-indigo-400",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600"
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
            backgroundPosition: "center 35%",
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
                <Briefcase size={52} className="text-emerald-300" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              Our Services
            </h1>
            
            <p className="text-lg md:text-xl text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
              Comprehensive healthcare services designed for your well-being, 
              delivered with compassion and excellence
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Shield size={16} className="text-emerald-300" />
                <span className="text-sm text-emerald-100">Quality Care</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Users size={16} className="text-emerald-300" />
                <span className="text-sm text-emerald-100">Patient First</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Star size={16} className="text-emerald-300" />
                <span className="text-sm text-emerald-100">Excellence</span>
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

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div 
                key={service.name} 
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100"
              >
                {/* Colored Top Bar */}
                <div className={`h-1.5 bg-gradient-to-r ${service.color}`} />
                
                <div className="p-6 text-center">
                  {/* Icon with Gradient Background */}
                  <div className={`inline-flex p-4 ${service.bgColor} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${service.iconColor}`} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-emerald-700 transition-colors">
                    {service.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <Clock className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">24/7 Availability</h4>
              <p className="text-sm text-gray-600">Round-the-clock medical support</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <Award className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Certified Experts</h4>
              <p className="text-sm text-gray-600">Board-certified specialists</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <Heart className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Patient-Centered</h4>
              <p className="text-sm text-gray-600">Personalized care plans</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-emerald-700 to-emerald-600 rounded-3xl p-10 md:p-14 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
          </div>
          
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Need Medical Assistance?
            </h2>
            <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
              Our team is ready to help you with expert care and personalized treatment
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button variant="white" size="lg" icon={Phone}>
                  Contact Us
                </Button>
              </Link>
              <Link to="/doctors">
                <Button variant="ghost" size="lg" className="text-white hover:bg-white/20">
                  Find a Doctor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;