import React, { useState, useEffect } from "react";
import { User, Donation } from "./types";
import Auth from "./components/Auth";
import Home from "./components/Home";
import DonationComponent from "./components/Donation";
import FoodAnalysis from "./components/FoodAnalysis";
import PreviousDonations from "./components/PreviousDonations";
import Profile from "./components/Profile";
import { Heart, Home as HomeIcon, Gift, Scale, History, User as UserIcon, LogOut, Menu, X } from "lucide-react";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>("home");
  const [donations, setDonations] = useState<Donation[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load user session from local storage on startup
  useEffect(() => {
    const savedUser = localStorage.getItem("mealbridge_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch (e) {
        console.error("Failed to parse saved user credentials", e);
      }
    }
  }, []);

  // Fetch donations for user whenever authenticated state changes
  useEffect(() => {
    if (user) {
      fetchDonations();
    } else {
      setDonations([]);
    }
  }, [user]);

  const fetchDonations = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/donations/user/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setDonations(data);
      }
    } catch (e) {
      console.error("Error retrieving user contributions history:", e);
    }
  };

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    localStorage.setItem("mealbridge_user", JSON.stringify(authenticatedUser));
    setActiveTab("home");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("mealbridge_user");
    setActiveTab("home");
  };

  // Safe navigation wrapper
  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  const tabs = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "donation", label: "Donations Portal", icon: Gift },
    { id: "analysis", label: "AI Quantity Advisor", icon: Scale },
    { id: "history", label: "History Log", icon: History },
    { id: "profile", label: "Donor Profile", icon: UserIcon }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Prime Header & Navigation Node */}
      <header className="sticky top-0 bg-white border-b border-slate-100 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Left Brand Identity */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavigate("home")}>
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-amber-500/10">
                <Heart className="w-5.5 h-5.5 fill-current" />
              </div>
              <div>
                <span className="font-serif text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight block">
                  MealBridge <span className="text-amber-600 font-sans text-xs sm:text-sm font-semibold tracking-wider bg-amber-50 px-2 py-0.5 rounded-md ml-1 border border-amber-200">AI</span>
                </span>
                <span className="hidden sm:block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Andhra Pradesh Welfare Network</span>
              </div>
            </div>

            {/* Middle Desktop Tabs */}
            <nav className="hidden md:flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleNavigate(tab.id)}
                    className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-amber-50 text-amber-700 shadow-3xs"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right User Logout / Action */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-800 truncate max-w-[120px]">{user.name}</span>
                <span className="block text-[9px] text-emerald-600 font-bold">★ Verified Donor</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 hover:text-red-650 text-slate-500 rounded-xl transition-all border border-slate-200"
                title="Sign out of MealBridge"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Menu Icon */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Area */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white shadow-lg py-3 px-4 space-y-2">
            <div className="pb-3 border-b border-slate-100 mb-2 px-2 flex justify-between items-center">
              <div>
                <span className="block text-xs font-bold text-slate-800">{user.name}</span>
                <span className="block text-[9px] text-emerald-600 font-bold">★ Verified AP Donor</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-[10px] uppercase font-bold text-red-650 flex items-center space-x-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavigate(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-amber-50 text-amber-700 font-bold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="transition-all duration-300">
          {activeTab === "home" && (
            <Home user={user} onNavigate={handleNavigate} />
          )}
          {activeTab === "donation" && (
            <DonationComponent
              user={user}
              onNavigate={handleNavigate}
              onDonationCreated={fetchDonations}
            />
          )}
          {activeTab === "analysis" && <FoodAnalysis />}
          {activeTab === "history" && (
            <PreviousDonations
              user={user}
              donations={donations}
              onNavigate={handleNavigate}
            />
          )}
          {activeTab === "profile" && (
            <Profile user={user} donations={donations} onLogout={handleLogout} />
          )}
        </div>
      </main>

      {/* Modern, Aesthetic Footnotes Block */}
      <footer className="bg-white border-t border-slate-100 text-slate-450 text-xs py-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <span className="font-semibold text-slate-800">MealBridge AI — Nourishing Connections</span>
            <p className="text-[10px] text-slate-400">Supporting Andhra Pradesh's zero-waste & zero-hunger community logistics.</p>
          </div>
          <div className="text-[10px] text-slate-400 leading-snug">
            All database state cached relative to local session environments. Built sustainably in India.
          </div>
        </div>
      </footer>
    </div>
  );
}
