import React from "react";
import {
  Mail,
  Lock,
  User,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import Notification from "../components/layout/Notification";
const Button = ({
  children,
  variant = "primary",
  className = "",
  isLoading = false,
  ...props
}) => {
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:bg-blue-400",
    secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
  };
  return (
    <button
      className={`px-6 py-4 rounded-2xl font-bold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

const Input = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <input
        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white transition-all duration-300"
        {...props}
      />
    </div>
  </div>
);

const Logo = ({ onClick }) => (
  <div
    className="flex flex-col items-center gap-3 cursor-pointer group"
    onClick={onClick}
  >
    <div className="relative">
      <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
      <div className="relative w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:-rotate-6 transition-transform duration-300">
        <div className="w-7 h-7 border-2 border-blue-500 rounded-md flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
    <div className="text-center">
      <span className="text-2xl font-black tracking-tighter leading-none block text-slate-900">
        EventZen
      </span>
    </div>
  </div>
);

/**
 * AUTH PAGE COMPONENT
 */
export default function Auth({
  currentPage,
  setCurrentPage,
  handleLogin,
  handleRegister,
  isLoading,
  notification,
}) {
  return (
    <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center p-6 relative overflow-hidden selection:bg-blue-100">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-60 -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-60 -z-10" />

      {/* NOTIFICATION */}
      <Notification notification={notification} />

      <div className="max-w-[440px] w-full space-y-8 animate-fade-in">
        {/* Header/Logo */}
        <Logo onClick={() => setCurrentPage("landing")} />

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-blue-900/5 overflow-hidden">
          <div className="p-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {currentPage === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-slate-500 mt-2 font-medium">
                {currentPage === "login"
                  ? "Access your premium event dashboard"
                  : "Join the world's most exclusive event circle"}
              </p>
            </div>

            <form
              onSubmit={currentPage === "login" ? handleLogin : handleRegister}
              className="space-y-5"
            >
              {currentPage === "register" && (
                <Input
                  label="Full Name"
                  name="name"
                  icon={User}
                  placeholder="Enter your name"
                  required
                />
              )}

              <Input
                label="Email Address"
                name="email"
                type="email"
                icon={Mail}
                placeholder="name@company.com"
                required
              />

              <Input
                label="Password"
                name="password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                required
              />

              <Button
                type="submit"
                className="w-full text-lg shadow-blue-100"
                isLoading={isLoading}
              >
                {currentPage === "login" ? "Sign In" : "Get Started"}
                {!isLoading && <ChevronRight className="w-5 h-5" />}
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-50 text-center">
              <p className="text-slate-500 font-medium text-sm">
                {currentPage === "login"
                  ? "New to EventZen?"
                  : "Already have an account?"}
                <button
                  onClick={() =>
                    setCurrentPage(
                      currentPage === "login" ? "register" : "login",
                    )
                  }
                  className="ml-2 text-blue-600 font-black hover:underline underline-offset-4"
                >
                  {currentPage === "login" ? "Create Account" : "Sign In"}
                </button>
              </p>
            </div>
          </div>

          {/* Trust Footer */}
          <div className="bg-slate-50/50 p-4 flex items-center justify-center gap-2 border-t border-slate-100">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Secure 256-bit Encryption
            </span>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => setCurrentPage("landing")}
          className="w-full flex items-center justify-center gap-2 text-slate-400 font-bold text-sm hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}
