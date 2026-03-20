import React, { useState, useEffect } from "react";
import {
  Calendar,
  Search,
  MapPin,
  ArrowRight,
  Ticket,
  UserPlus,
  Sparkles,
  ShieldCheck,
  Zap,
  ChevronRight,
  Globe,
  Award,
  Users,
} from "lucide-react";

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200",
    secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-600 hover:text-blue-600 hover:bg-blue-50",
  };
  return (
    <button
      className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-3xl border border-gray-100 transition-all duration-500 ${className}`}
  >
    {children}
  </div>
);

const Notification = ({ notification }) => {
  if (!notification) return null;
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/10">
        <Sparkles className="w-4 h-4 text-yellow-400" />
        <span className="text-sm font-medium">
          {notification.message || notification}
        </span>
      </div>
    </div>
  );
};

/**
 * MAIN LANDING COMPONENT
 */
export default function App({
  setCurrentPage = () => {},
  notification = null,
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFBFF] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-700">
      <Notification notification={notification} />

      {/* PREMIUM NAVBAR */}
      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-500 ${
          scrolled
            ? "py-4 bg-white/80 backdrop-blur-xl shadow-sm"
            : "py-8 bg-transparent"
        }`}
      >
        <div className="max-w-9xl mx-auto px-8 flex justify-between items-center">
          {/* NEW LOGO DESIGN */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:-rotate-6 transition-transform duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent" />
                <Sparkles className="w-6 h-6 text-blue-400 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-6 h-6 border-2 border-blue-500 rounded-md flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800">
                EventZen
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentPage("login")}
              className="font-bold text-gray-500 hover:text-blue-600 transition-colors text-sm"
            >
              Sign In
            </button>
            <Button
              onClick={() => setCurrentPage("register")}
              className="py-2.5 px-5 text-sm"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="relative pt-40 pb-20 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10" />

        <div className="max-w-9xl mx-auto px-28 grid lg:grid-cols-2 gap-20 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-10">
            <h1 className="text-7xl md:text-8xl font-black leading-[0.9] tracking-tight text-slate-900">
              Find. Book. <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-blue-600">Attend.</span>
                <div className="absolute -bottom-2 left-0 w-full h-4 bg-blue-100 -z-10 rounded-full" />
              </span>
            </h1>

            <p className="text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
              Experience seamless venue discovery and guest management. Elevate
              your events with EventZen's premium toolkit.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                onClick={() => setCurrentPage("login")}
                className="px-10 py-5 text-lg"
              >
                Get Started <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
              <Button
                onClick={() => setCurrentPage("register")}
                variant="secondary"
                className="px-10 py-5 text-lg"
              >
                Explore Venues
              </Button>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-slate-200"
                  />
                ))}
              </div>
              <p className="text-sm font-semibold">
                Join 2,000+ hosts worldwide
              </p>
            </div>
          </div>

          {/* RIGHT MOCK INTERFACE */}
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <Card className="relative z-10 shadow-2xl shadow-blue-900/10 overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-700">
              <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-slate-200 rounded-full" />
                  <div className="w-3 h-3 bg-slate-200 rounded-full" />
                  <div className="w-3 h-3 bg-slate-200 rounded-full" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-[11px] text-gray-400 font-bold shadow-sm">
                  <Search className="w-3 h-3" />
                  Search iconic venues...
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="relative h-56 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center overflow-hidden">
                  <MapPin className="w-16 h-16 text-blue-200 animate-pulse" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-blue-600 shadow-sm uppercase tracking-wider">
                    Featured
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">
                        The Grand Symphony Hall
                      </h3>
                      <p className="text-slate-500 font-medium">
                        Mumbai, MH • 500 Capacity
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 uppercase font-black">
                        Starting from
                      </p>
                      <p className="text-xl font-black text-blue-600">
                        ₹45,000
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      Availability
                    </p>
                    <p className="text-sm font-bold text-green-600">
                      Next Available: Today
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      Rating
                    </p>
                    <p className="text-sm font-bold">4.9/5.0 ★</p>
                  </div>
                </div>

                <Button
                  onClick={() => setCurrentPage("login")}
                  className="w-full py-4 text-lg rounded-2xl"
                >
                  Confirm Booking <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </Card>

            <div className="absolute -bottom-6 -left-10 z-20 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">
                    Verified
                  </p>
                  <p className="text-sm font-black text-slate-800">
                    Premium Vendors
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* NEW STATISTICS SECTION */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 items-center text-center">
            <div className="space-y-1">
              <p className="text-4xl font-black text-slate-900">200+</p>
              <div className="flex items-center justify-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-widest">
                <Ticket className="w-3.5 h-3.5" />
                <span>Events Hosted</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-4xl font-black text-slate-900">50+</p>
              <div className="flex items-center justify-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-widest">
                <MapPin className="w-3.5 h-3.5" />
                <span>Premium Venues</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-4xl font-black text-slate-900">1000+</p>
              <div className="flex items-center justify-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-widest">
                <Users className="w-3.5 h-3.5" />
                <span>Happy Attendees</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-4xl font-black text-slate-900">12+</p>
              <div className="flex items-center justify-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-widest">
                <Globe className="w-3.5 h-3.5" />
                <span>Cities Covered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="bg-white py-32 relative">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              One Platform, Endless Possibilities
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto font-medium">
              Everything you need to host, manage, and scale your events with
              professional precision.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Ticket />}
              title="Seamless Booking"
              description="End-to-end encrypted booking flow that settles in seconds, not hours."
            />
            <FeatureCard
              icon={<UserPlus />}
              title="Smart Guest Management"
              description="Automated check-ins and intelligent attendee tracking at your fingertips."
            />
            <FeatureCard
              icon={<Award />}
              title="Exclusive Venues"
              description="Access to hand-picked, high-capacity locations that aren't available anywhere else."
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer">
            <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center">
              <div className="w-2.5 h-2.5 border-2 border-blue-500 rounded-sm" />
            </div>
            <span className="text-lg font-black tracking-tighter">
              EventZen
            </span>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            © 2024 EventZen Luxury Management. All rights reserved.
          </p>
          <div className="flex gap-8 text-slate-400 font-bold text-sm">
            <a href="#" className="hover:text-blue-600 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </footer>

      {/* Custom Animations in CSS Style */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-8 rounded-3xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-500 group">
      <div className="w-14 h-14 bg-white shadow-sm border border-gray-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-transform">
        {React.cloneElement(icon, { className: "w-6 h-6" })}
      </div>
      <h3 className="text-xl font-black mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
}
