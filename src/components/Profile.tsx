import React from "react";
import { User, Donation } from "../types";
import { User as UserIcon, Mail, Phone, Calendar, Shield, Award, LogOut, CheckCircle, Heart, Star } from "lucide-react";
import { motion } from "motion/react";

interface ProfileProps {
  user: User;
  donations: Donation[];
  onLogout: () => void;
}

export default function Profile({ user, donations, onLogout }: ProfileProps) {
  const count = donations.length;
  const totalKg = donations.reduce((acc, curr) => acc + curr.amount, 0);
  const totalServings = totalKg * 3;
  const distinctSheltersCount = new Set(donations.map((d) => d.shelterId)).size;

  // Determine donor tier based on history
  const getDonorTier = () => {
    if (totalKg >= 100) return { name: "Anantha Datri (Infinite Provider)", color: "text-amber-600 bg-amber-50 border-amber-250", icon: Award };
    if (totalKg >= 40) return { name: "Prerna Donor (Inspirational Lead)", color: "text-indigo-600 bg-indigo-50 border-indigo-250", icon: Star };
    return { name: "Karuna Seva (Compassionate Server)", color: "text-emerald-700 bg-emerald-50 border-emerald-250", icon: Heart };
  };

  const tier = getDonorTier();

  return (
    <div className="space-y-10 max-w-4xl">
      {/* Title Header */}
      <div className="space-y-2">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-slate-900">Your Donor Profile</h2>
        <p className="text-slate-500 text-sm">
          Manage your credentials, contribution records, and honorary service badges in Andhra Pradesh.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Profile Card left */}
        <div className="md:col-span-1 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center space-y-6">
          <div className="relative inline-block mx-auto">
            <div className="w-24 h-24 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mx-auto font-serif text-3xl font-bold border-2 border-amber-200">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="absolute bottom-[-10px] right-[-10px] bg-emerald-600 text-white p-1.5 rounded-full shadow border-2 border-white">
              <CheckCircle className="w-4 h-4" />
            </span>
          </div>

          <div className="space-y-1 pb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-lg sm:text-xl truncate">{user.name}</h3>
            {/* Honor label */}
            <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${tier.color} uppercase tracking-wider`}>
              <tier.icon className="w-3.5 h-3.5" />
              <span>{tier.name}</span>
            </div>
          </div>

          {/* User detail lines */}
          <div className="text-left text-xs space-y-4 text-slate-650">
            <div className="flex items-center space-x-3.5">
              <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div className="truncate">
                <span className="block text-[9px] uppercase font-bold text-slate-400">Email Address</span>
                <span className="font-semibold text-slate-700">{user.email}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3.5">
              <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-400">Phone Number</span>
                <span className="font-semibold text-slate-700">{user.phoneNumber}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3.5">
              <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-400">Member Since</span>
                <span className="font-semibold text-slate-700">{user.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={onLogout}
            className="w-full border border-red-200 hover:bg-red-50 text-red-650 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Profile</span>
          </button>
        </div>

        {/* Contributions stats card right */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-8">
            <h3 className="font-serif text-xl font-bold text-slate-900 border-b border-indigo-100 pb-3">Contribution Metrics</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 bg-amber-600/5 border border-amber-500/10 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Food Donated</span>
                <div className="text-3xl font-bold text-amber-700 font-mono">{totalKg} <span className="text-lg font-sans">KGs</span></div>
                <p className="text-slate-400 text-[10px]">
                  Measured cumulatively across all coordinated pickups.
                </p>
              </div>

              <div className="p-5 bg-emerald-600/5 border border-emerald-500/10 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Estimated Meals Provided</span>
                <div className="text-3xl font-bold text-emerald-700 font-mono">{totalServings} <span className="text-lg font-sans">meals</span></div>
                <p className="text-slate-400 text-[10px]">
                  Based on institutional serving standard metric of 350g per head.
                </p>
              </div>

              <div className="p-5 bg-indigo-600/5 border border-indigo-500/10 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Coordinated Collections</span>
                <div className="text-3xl font-bold text-indigo-700 font-mono">{count} <span className="text-lg font-sans">logins</span></div>
                <p className="text-slate-400 text-[10px]">
                  Total number of confirmed requests matching Andhra shelters.
                </p>
              </div>

              <div className="p-5 bg-slate-100/60 border border-slate-200 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Supported Shelters</span>
                <div className="text-3xl font-bold text-slate-800 font-mono">{distinctSheltersCount} <span className="text-lg font-sans">centres</span></div>
                <p className="text-slate-400 text-[10px]">
                  Verified target homes reached under your active service profile.
                </p>
              </div>
            </div>
          </div>

          {/* Honorary Level Quote Callout */}
          <div className="p-6 bg-gradient-to-tr from-amber-600 to-amber-700 text-white rounded-3xl space-y-2 relative overflow-hidden shadow-lg shadow-amber-600/10">
            <div className="absolute right-[-20px] top-[-20px] text-white/5 font-serif text-9xl pointer-events-none select-none italic font-bold">AP</div>
            <h4 className="font-semibold text-sm flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-amber-200" />
              <span>Andhra Pradesh Food Security Mission</span>
            </h4>
            <p className="text-xs text-amber-100 leading-relaxed font-serif max-w-xl">
              "Koti thummalatho rani dhyanam, okanni aakali tircina dhyanam tho samanam" (Filling one hungry stomach brings peace greater than millions of deep prayers). Thank you for being a critical pillar of MealBridge AI’s mission to coordinate hospitality in our province.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
