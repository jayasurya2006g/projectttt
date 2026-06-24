import React, { useState } from "react";
import { Mail, Lock, User, Phone, Heart, Sparkles, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { User as UserType } from "../types";

interface AuthProps {
  onAuthSuccess: (user: UserType) => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin
      ? { email, password }
      : { name, email, phoneNumber, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      onAuthSuccess(data);
    } catch (err: any) {
      setError(err.message || "Failed to authenticate. Check server connection.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCreds = () => {
    setIsLogin(true);
    setEmail("donor@mealbridge.org");
    setPassword("password123");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center mb-8 text-center"
      >
        <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4">
          <Heart className="w-8 h-8 text-white fill-current" />
        </div>
        <h1 className="font-serif text-4xl font-semibold text-slate-900 tracking-tight">
          MealBridge <span className="text-amber-600">AI</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500 max-w-xs sm:max-w-md">
          Connecting hospitality with humanity. Donate surplus food to verified shelters across Andhra Pradesh with AI-powered quantity planning.
        </p>
      </motion.div>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-3xl ltr shadow-xl border border-slate-100 p-8"
      >
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
            className={`pb-2 px-4 text-sm font-semibold transition-all duration-200 border-b-2 ${
              isLogin ? "text-amber-600 border-amber-500" : "text-slate-400 border-transparent hover:text-slate-600"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
            className={`pb-2 px-4 text-sm font-semibold transition-all duration-200 border-b-2 ${
              !isLogin ? "text-amber-600 border-amber-500" : "text-slate-400 border-transparent hover:text-slate-600"
            }`}
          >
            New Donor Registration
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs rounded-xl flex items-start space-x-2 border border-red-100">
            <span className="font-semibold">Error:</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Full Name / Organization Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rama Foundation / Jayasurya"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-250 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Phone className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. +91 94901 23456"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-250 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail className="h-4.5 w-4.5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="donor@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-250 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-250 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3.5 px-4 rounded-xl text-sm font-semibold shadow-md shadow-amber-600/10 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>{isLogin ? "Sign In" : "Register & Start Saving"}</span>
              </>
            )}
          </button>
        </form>

        {isLogin && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center">
            <button
              onClick={fillDemoCreds}
              className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Use sandbox profile for rapid testing? Click here.</span>
            </button>
            <p className="mt-2 text-[10px] text-slate-400">
              Auto-registers "donor@mealbridge.org" as Jayasurya in AP.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
