// src/pages/Home.tsx
import {
  ArrowRight,
  Stethoscope,
  CalendarDays,
  Users,
  Clock,
  Phone,
  Mail,
  MapPin,
  Shield,
  Heart,
  Award,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common";
import Footer from "../components/layout/Footer";
import hospitalBg from "../assets/hospital-bg.jpg";

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  
  const handleGetStarted = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/dashboard");
    }
  };
  
  return (
    <div className="min-h-screen bg-emerald-50">
      {/* ===== Hero Section ===== */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: `url(${hospitalBg})` }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-emerald-900/70 via-emerald-800/50 to-emerald-900/70" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 border border-white/20 mb-8">
            <Activity className="w-5 h-5 text-emerald-300" />
            <span className="text-base font-medium text-white">
              Leading Healthcare Provider in 2026
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight tracking-tight">
            Your Health,
            <span className="text-emerald-300 block">Our Priority</span>
          </h1>

          <p className="mt-6 text-xl sm:text-2xl text-emerald-100/90 max-w-3xl mx-auto leading-relaxed">
            Experience world-class healthcare with cutting-edge technology,
            compassionate doctors, and personalized treatment plans tailored
            just for you.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              className="shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 text-lg px-8 py-4"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
            <Button
              variant="white"
              size="lg"
              icon={Stethoscope}
              className="text-lg px-8 py-4"
            >
              Find a Doctor
            </Button>
          </div>

          <div className="mt-12 flex justify-center gap-8 sm:gap-12 text-white/80">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">50+</div>
              <div className="text-base mt-1 text-emerald-200">
                Expert Doctors
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">10k+</div>
              <div className="text-base mt-1 text-emerald-200">
                Happy Patients
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">99%</div>
              <div className="text-base mt-1 text-emerald-200">
                Success Rate
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* ===== Why Choose Us Section ===== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-5 py-2 bg-emerald-100 text-emerald-700 text-base font-semibold rounded-full tracking-wide">
            Why Choose Us
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-emerald-900">
            Comprehensive Healthcare Services
          </h2>
          <p className="mt-3 text-xl text-emerald-700 max-w-2xl mx-auto">
            We combine medical expertise with compassionate care to deliver the
            best outcomes for our patients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-emerald-100/50 hover:border-emerald-200 group">
            <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 transition-colors duration-300">
              <Heart className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold text-emerald-900">
              Expert Doctors
            </h3>
            <p className="mt-2 text-lg text-emerald-700 leading-relaxed">
              Board-certified specialists with years of experience in their
              respective fields.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-emerald-100/50 hover:border-emerald-200 group">
            <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 transition-colors duration-300">
              <Shield className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold text-emerald-900">
              Advanced Technology
            </h3>
            <p className="mt-2 text-lg text-emerald-700 leading-relaxed">
              State-of-the-art equipment and modern diagnostic tools for
              accurate treatment.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-emerald-100/50 hover:border-emerald-200 group">
            <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 transition-colors duration-300">
              <Award className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold text-emerald-900">
              Quality Care
            </h3>
            <p className="mt-2 text-lg text-emerald-700 leading-relaxed">
              Patient-centered approach with personalized treatment plans and
              follow-up care.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Our Services Section ===== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-5 py-2 bg-emerald-100 text-emerald-700 text-base font-semibold rounded-full tracking-wide">
              Our Services
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-emerald-900">
              World-Class Medical Services
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-emerald-50 rounded-2xl p-8 text-center hover:bg-emerald-100 transition-all duration-300 cursor-pointer border border-emerald-100">
              <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <Stethoscope className="w-10 h-10 text-white" />
              </div>
              <h4 className="mt-4 text-xl font-semibold text-emerald-900">
                Cardiology
              </h4>
              <p className="mt-1 text-base text-emerald-700">
                Heart care & treatment
              </p>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-8 text-center hover:bg-emerald-100 transition-all duration-300 cursor-pointer border border-emerald-100">
              <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <Activity className="w-10 h-10 text-white" />
              </div>
              <h4 className="mt-4 text-xl font-semibold text-emerald-900">
                Neurology
              </h4>
              <p className="mt-1 text-base text-emerald-700">
                Brain & nervous system
              </p>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-8 text-center hover:bg-emerald-100 transition-all duration-300 cursor-pointer border border-emerald-100">
              <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h4 className="mt-4 text-xl font-semibold text-emerald-900">
                Orthopedics
              </h4>
              <p className="mt-1 text-base text-emerald-700">
                Bone & joint care
              </p>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-8 text-center hover:bg-emerald-100 transition-all duration-300 cursor-pointer border border-emerald-100">
              <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h4 className="mt-4 text-xl font-semibold text-emerald-900">
                Pediatrics
              </h4>
              <p className="mt-1 text-base text-emerald-700">
                Children's healthcare
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-emerald-700 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-5 py-2 bg-white/20 text-white text-base font-semibold rounded-full">
                Book Now
              </span>
              <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-white">
                Ready to Get Started?
              </h2>
              <p className="mt-3 text-xl text-emerald-100/90">
                Schedule your appointment today and take the first step towards
                better health.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  variant="white"
                  size="lg"
                  icon={CalendarDays}
                  className="text-lg px-8 py-4"
                >
                  Book Appointment
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  icon={Phone}
                  className="text-white hover:bg-white/20 hover:text-white text-lg px-8 py-4"
                >
                  Call Us
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-white border border-white/10">
                <Clock className="w-7 h-7 text-emerald-300" />
                <p className="mt-2 text-base font-medium">24/7 Available</p>
                <p className="text-sm text-emerald-200">Emergency services</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-white border border-white/10">
                <Users className="w-7 h-7 text-emerald-300" />
                <p className="mt-2 text-base font-medium">Expert Team</p>
                <p className="text-sm text-emerald-200">50+ specialists</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-white border border-white/10">
                <Heart className="w-7 h-7 text-emerald-300" />
                <p className="mt-2 text-base font-medium">Quality Care</p>
                <p className="text-sm text-emerald-200">99% satisfaction</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-white border border-white/10">
                <Activity className="w-7 h-7 text-emerald-300" />
                <p className="mt-2 text-base font-medium">Modern Tech</p>
                <p className="text-sm text-emerald-200">Advanced equipment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;