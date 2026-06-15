import React, { useState } from "react";
import { CheckSquare, ArrowRight, Kanban, List, Shield, RefreshCw, KeyRound, Mail, User, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { localSignIn, localSignUp } from "../localStore";
import { UserProfile } from "../types";

interface LandingPageProps {
  onAuthSuccess: (user: UserProfile) => void;
}

export default function LandingPage({ onAuthSuccess }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  
  // Form values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // State indicators
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setDisplayName("");
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleTabChange = (tab: "signin" | "signup") => {
    setActiveTab(tab);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (activeTab === "signin") {
      const { user, error } = localSignIn(email, password);
      if (error) {
        setErrorMsg(error);
      } else {
        onAuthSuccess(user);
      }
    } else {
      if (!displayName.trim()) {
        setErrorMsg("Display name is required to create a workspace account.");
        return;
      }
      if (password.length < 6) {
        setErrorMsg("Password must be at least 6 characters long.");
        return;
      }
      
      const { user, error } = localSignUp(email, password, displayName);
      if (error) {
        setErrorMsg(error);
      } else {
        setSuccessMsg("Registration successful! Welcome to TaskFlow.");
        setTimeout(() => {
          onAuthSuccess(user);
        }, 1000);
      }
    }
  };

  // Prepopulate Demo Account to let the user log in immediately
  const handleLoadDemo = () => {
    setEmail("demo@taskflow.com");
    setPassword("password123");
    setActiveTab("signin");
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A443F] flex flex-col justify-between font-sans" id="landing-page">
      {/* Editorial Top Navbar */}
      <header className="border-b border-[#E8E3D9] bg-[#FDFBF7]/85 backdrop-blur-md sticky top-0 z-50 py-4 px-6 sm:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="bg-[#606C38] text-[#FEFAE0] p-2.5 rounded-2xl shadow-sm border border-[#606C38]/20">
            <CheckSquare id="logo-icon" className="w-5 h-5" />
          </div>
          <span className="font-bold text-[#606C38] text-xl tracking-tight font-serif italic">TaskFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadDemo}
            className="text-xs font-bold text-[#8A847E] hover:text-[#4A443F] bg-[#F5F2ED] hover:bg-[#E8E3D9] px-4 py-2 rounded-full transition cursor-pointer"
          >
            Quick Sandbox Demo
          </button>
        </div>
      </header>

      {/* Hero and Form Dual-Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Descriptive Hero Columns */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <h1 className="text-4xl sm:text-6xl font-black text-[#4A443F] tracking-tight leading-tight">
            Cultivate your focus with{" "}
            <span className="font-serif italic font-medium text-[#606C38] block sm:inline">
              pure clarity.
            </span>
          </h1>

          <p className="text-[#8A847E] text-base sm:text-lg leading-relaxed max-w-xl">
            A beautiful, lightweight workspace designed to manage your lists and Kanban columns natively. 
            All credentials, profiles, and tasks reside safely on your private device.
          </p>

          {/* Core App Features list */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="flex items-start gap-2"/>
            <div className="space-y-4 col-span-3">
              <div className="flex items-center gap-3 text-sm font-semibold text-[#4A443F]">
                <div className="bg-[#FEFAE0] text-[#606C38] p-1.5 rounded-lg border border-[#E8E3D9]">
                  <Kanban className="w-4 h-4" />
                </div>
                <span>Responsive Visual Kanban Pipelines</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-[#4A443F]">
                <div className="bg-[#FEFAE0] text-[#BC6C25] p-1.5 rounded-lg border border-[#E8E3D9]">
                  <List className="w-4 h-4" />
                </div>
                <span>Flexible Sorted Lists & Custom Tags</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-[#4A443F]">
                <div className="bg-[#FEFAE0] text-[#606C38] p-1.5 rounded-lg border border-[#E8E3D9]">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <span>No servers, logins or telemetry slop</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Authentication Form Column */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-[#E8E3D9] shadow-xl p-6 sm:p-8 space-y-6">
            {/* Tab selection control */}
            <div className="flex bg-[#F5F2ED] p-1 rounded-2xl border border-[#E8E3D9]">
              <button
                type="button"
                onClick={() => handleTabChange("signin")}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                  activeTab === "signin"
                    ? "bg-white text-[#606C38] shadow-sm"
                    : "text-[#8A847E] hover:text-[#4A443F]"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("signup")}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                  activeTab === "signup"
                    ? "bg-white text-[#606C38] shadow-sm"
                    : "text-[#8A847E] hover:text-[#4A443F]"
                }`}
              >
                Register
              </button>
            </div>

            {/* Title / Description */}
            <div className="text-center space-y-1">
              <h2 className="text-xl font-serif italic text-[#606C38] font-bold">
                {activeTab === "signin" ? "Sign In to TaskFlow" : "Create Private Profile"}
              </h2>
              <p className="text-xs text-[#8A847E]">
                {activeTab === "signin"
                  ? "Access your dashboard and task archives"
                  : "Register with offline mock credentials"}
              </p>
            </div>

            {/* Error & Success Messages */}
            {errorMsg && (
              <div className="bg-[#FEFAE0] border border-[#BC6C25]/20 text-[#BC6C25] text-xs p-3.5 rounded-xl flex items-start gap-2 text-left">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-medium">{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="bg-[#FEFAE0] border border-[#606C38]/20 text-[#606C38] text-xs p-3.5 rounded-xl flex items-start gap-2 text-left">
                <CheckSquare className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-medium">{successMsg}</span>
              </div>
            )}

            {/* Active Credentials Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Display name field (Signup only) */}
              {activeTab === "signup" && (
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-[#8A847E]/90 uppercase tracking-widest block">
                    Full Name / Alias
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A847E]/60" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Doe"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FDFBF7] border border-[#E8E3D9] rounded-xl text-sm font-semibold outline-none focus:border-[#606C38] focus:ring-2 focus:ring-[#606C38]/10 text-[#4A443F]"
                    />
                  </div>
                </div>
              )}

              {/* Email Address field */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-[#8A847E]/90 uppercase tracking-widest block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A847E]/60" />
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FDFBF7] border border-[#E8E3D9] rounded-xl text-sm font-semibold outline-none focus:border-[#606C38] focus:ring-2 focus:ring-[#606C38]/10 text-[#4A443F]"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5 text-left">
                <div className="flex justify-between">
                  <label className="text-[10px] font-bold text-[#8A847E]/90 uppercase tracking-widest block">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A847E]/60" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-[#FDFBF7] border border-[#E8E3D9] rounded-xl text-sm font-semibold outline-none focus:border-[#606C38] focus:ring-2 focus:ring-[#606C38]/10 text-[#4A443F]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A847E] hover:text-[#4A443F] p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Trigger Actions */}
              <button
                type="submit"
                className="w-full bg-[#606C38] hover:bg-[#4f582f] text-[#FEFAE0] font-bold py-3 px-4 rounded-xl transition duration-200 cursor-pointer shadow-sm mt-3 flex items-center justify-center gap-1.5"
              >
                {activeTab === "signin" ? "Log In" : "Register"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick pre-loading link helper */}
            {activeTab === "signin" && (
              <div className="pt-2 border-t border-[#E8E3D9]/60 text-center">
                <button
                  type="button"
                  onClick={handleLoadDemo}
                  className="text-xs font-bold text-[#606C38] hover:underline cursor-pointer"
                >
                  Or click here to instantly auto-load the demo workspace
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Styled Clean Footer */}
      <footer className="py-6 border-t border-[#E8E3D9] bg-[#F5F2ED]/60 text-center text-xs text-[#8A847E] font-medium">
        © {new Date().getFullYear()} TaskFlow. Cultivating workspace isolation & focused task management.
      </footer>
    </div>
  );
}
