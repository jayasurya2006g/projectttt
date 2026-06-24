import React from "react";
import { Heart, Utensils, TrendingUp, MapPin, Sparkles, Globe, Shield } from "lucide-react";
import { motion } from "motion/react";
import { User } from "../types";

interface HomeProps {
  user: User;
  onNavigate: (tab: string) => void;
}

export default function Home({ user, onNavigate }: HomeProps) {
  return (
    <div className="space-y-12">
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-br from-amber-600 to-amber-700 rounded-3xl overflow-hidden p-8 sm:p-12 text-white shadow-xl shadow-amber-600/15"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
        <div className="relative max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-200 fill-current" />
            <span>Empathetic AI Food Logistics</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            Namaste, {user.name}! Let's close the hunger loop in Andhra Pradesh.
          </h2>
          <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
            Welcome to <strong className="text-white">MealBridge AI</strong>. We help you calculate exactly how much food to cook to minimize leftovers, and easily find verified orphanages, old-age homes, and Anadhasramas within a 50km radius in Andhra Pradesh to receive your generous food donations.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate("donation")}
              className="bg-white text-amber-700 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-md"
            >
              Donate Food Now
            </button>
            <button
              onClick={() => onNavigate("analysis")}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-white border border-white/20 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
            >
              Analyze Cooking Scale
            </button>
          </div>
        </div>
      </motion.div>

      {/* Website Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6"
        >
          <h3 className="font-serif text-2xl font-bold text-slate-900">About MealBridge AI</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            MealBridge AI was created with a clear mission: **to tackle both sides of the food crisis**. In Andhra Pradesh, massive celebrations, institutional programs, hostels, and family milestones often produce significant surplus food. At the same time, numerous welfare homes are constantly in need of safe, nutritious meals.
          </p>
          <p className="text-slate-600 text-sm leading-relaxed">
            Through **MealBridge AI**, we bridge this gap by offering two core capabilities in a single unified dashboard:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0 text-amber-600">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">Smart Food Scale Optimizer</h4>
                <p className="text-slate-500 text-xs mt-1 leading-snug">
                  Enter your target headcounts, food items, and meals. Our AI analyzes food weights and outputs precise raw ingredient ratios to cook without leftovers.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0 text-emerald-600">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">Andhra Pradesh Shelter Matchmaker</h4>
                <p className="text-slate-500 text-xs mt-1 leading-snug">
                  Matches your custom address against 20 verified old-age homes and orphanages across Andhra Pradesh, automatically sorting by distance.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Numbers / Info cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-amber-600/5 border border-amber-500/10 rounded-3xl p-8 flex flex-col justify-between"
        >
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-slate-900">Our Reach</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center space-x-4">
                <div className="text-2xl font-bold text-amber-600 font-mono">20+</div>
                <div className="text-xs text-slate-500 font-medium">Verified Welfare & Old-Age Homes in AP</div>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center space-x-4">
                <div className="text-2xl font-bold text-emerald-600 font-mono">50 km</div>
                <div className="text-xs text-slate-500 font-medium font-sans">Active Geographical Proximity Range</div>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center space-x-4">
                <div className="text-2xl font-bold text-slate-800 font-mono">100%</div>
                <div className="text-xs text-slate-500 font-medium">Direct shelter-donor coordination transparency</div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white rounded-2xl border border-amber-200/50 text-xs text-amber-800 leading-relaxed flex items-start space-x-2">
            <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span><strong>Hygiene Notice:</strong> We encourage all donors to deliver cooked food within 2 to 3 hours of preparation. Packing food inside insulated sanitized containers keeps it safe!</span>
          </div>
        </motion.div>
      </div>

      {/* Interactive Process Guide */}
      <div className="space-y-6">
        <h3 className="font-serif text-2xl font-bold text-slate-900 text-center">How MealBridge Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3 relative overflow-hidden">
            <div className="text-lg font-bold text-amber-100 font-mono absolute top-4 right-6 text-5xl">01</div>
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-2">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-slate-800">Plan with Food Advisor</h4>
            <p className="text-slate-550 text-xs leading-relaxed">
              Use our AI Food Quantities Advisor before cooking. Simply enter the targeted headcount and recipe to get optimized cooking measures, keeping leftovers to a minimum.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3 relative overflow-hidden">
            <div className="text-lg font-bold text-amber-100 font-mono absolute top-4 right-6 text-5xl">02</div>
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-2">
              <MapPin className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-slate-800">Submit Donation Address</h4>
            <p className="text-slate-550 text-xs leading-relaxed">
              If surplus food is available, enter your location address in our donation form. MealBridge instantly resolves your regional coordinates in Andhra Pradesh.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3 relative overflow-hidden">
            <div className="text-lg font-bold text-amber-100 font-mono absolute top-4 right-6 text-5xl">03</div>
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-2">
              <Heart className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-slate-800">Coordinate Pickup</h4>
            <p className="text-slate-550 text-xs leading-relaxed">
              Our finder displays homes within a 50km radius. Simply tap "Connect" to log a donation, instantly obtaining their direct contact detail so you can transfer your feed!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
