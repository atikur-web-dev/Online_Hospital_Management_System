// src/pages/About.tsx
import { Users, Heart, Award, Target, Stethoscope, Clock, Shield, Globe, Building2, Mail, Phone, MapPin, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "../components/common";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";

const About = () => {
  const values = [
    { 
      icon: Heart, 
      name: "Compassion", 
      description: "We treat every patient with empathy and respect",
      color: "from-rose-500 to-rose-400",
      bgColor: "bg-rose-50",
      iconColor: "text-rose-600"
    },
    { 
      icon: Award, 
      name: "Excellence", 
      description: "Committed to delivering the highest quality care",
      color: "from-amber-500 to-amber-400",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600"
    },
    { 
      icon: Target, 
      name: "Innovation", 
      description: "Embracing cutting-edge medical technology",
      color: "from-blue-500 to-blue-400",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    { 
      icon: Shield, 
      name: "Integrity", 
      description: "Transparent and ethical healthcare practices",
      color: "from-emerald-500 to-emerald-400",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600"
    },
  ];

  const stats = [
    { number: "50+", label: "Expert Doctors", icon: Users },
    { number: "10k+", label: "Happy Patients", icon: Heart },
    { number: "99%", label: "Success Rate", icon: Award },
    { number: "24/7", label: "Support Available", icon: Clock },
  ];

  const milestones = [
    { year: "2020", title: "Founded", description: "CarePlus was established with a vision to provide world-class healthcare" },
    { year: "2022", title: "Expansion", description: "Opened new state-of-the-art facilities and departments" },
    { year: "2024", title: "Innovation", description: "Launched telemedicine services and advanced diagnostic tools" },
    { year: "2026", title: "Excellence", description: "Recognized as a leading healthcare provider in the region" },
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
              url('https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
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
                <Building2 size={52} className="text-emerald-300" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              About CarePlus
            </h1>
            
            <p className="text-lg md:text-xl text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
              Dedicated to providing exceptional healthcare with compassion, 
              innovation, and unwavering commitment to excellence
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Heart size={16} className="text-emerald-300" />
                <span className="text-sm text-emerald-100">Patient First</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Shield size={16} className="text-emerald-300" />
                <span className="text-sm text-emerald-100">Quality Care</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Globe size={16} className="text-emerald-300" />
                <span className="text-sm text-emerald-100">Global Standards</span>
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

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label} 
                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 group"
              >
                <div className="inline-flex p-3 bg-emerald-50 rounded-xl mb-3 group-hover:bg-emerald-600 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="text-3xl font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 mt-1 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full mb-4">
              <Heart size={16} />
              Our Mission
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Your Health, <span className="text-emerald-600">Our Priority</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              At CarePlus, we believe that everyone deserves access to world-class healthcare. 
              Our mission is to deliver comprehensive, patient-centered medical care using the 
              latest technology and evidence-based practices.
            </p>
            <p className="text-gray-600 leading-relaxed">
              With a team of highly skilled specialists and state-of-the-art facilities, 
              we're committed to improving the health and well-being of our community.
            </p>
            
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-700">Patient-centered approach</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-700">Advanced medical technology</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-700">Compassionate care team</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/doctors">
                <Button variant="primary" size="lg" icon={Users}>
                  Meet Our Team
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="ghost" size="lg" icon={ArrowRight} iconPosition="right">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="grid gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <Clock className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800">24/7 Availability</h4>
                  </div>
                  <p className="text-sm text-gray-600 pl-12">Round-the-clock medical support for emergencies</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <Shield className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800">Quality Assurance</h4>
                  </div>
                  <p className="text-sm text-gray-600 pl-12">Accredited healthcare services with strict quality standards</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <Globe className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800">Global Standards</h4>
                  </div>
                  <p className="text-sm text-gray-600 pl-12">International best practices in healthcare delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full mb-4">
              <Award size={16} />
              Our Values
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Core Values That Define Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at CarePlus
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div 
                  key={value.name} 
                  className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 text-center"
                >
                  <div className={`inline-flex p-4 ${value.bgColor} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${value.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-700 transition-colors">
                    {value.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full mb-4">
              <Clock size={16} />
              Our Journey
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Milestones & Achievements
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our journey of excellence in healthcare delivery
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="relative">
                {index < milestones.length - 1 && (
                  <div className="hidden md:block absolute top-20 left-[60%] w-full h-0.5 bg-emerald-200">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-500 rounded-full" />
                  </div>
                )}
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">{milestone.year}</div>
                  <div className="w-12 h-0.5 bg-emerald-300 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{milestone.title}</h4>
                  <p className="text-sm text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 rounded-3xl p-10 md:p-14 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
          </div>
          
          <div className="relative">
            <Heart className="w-16 h-16 mx-auto mb-4 text-emerald-200" />
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Join Us in Our Mission
            </h2>
            <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
              Experience world-class healthcare delivered with compassion, 
              innovation, and excellence
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button variant="white" size="lg" icon={Phone}>
                  Contact Us Today
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
      <Footer/>
    </div>
  );
};

export default About;