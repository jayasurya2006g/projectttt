import React, { useState } from "react";
import { Clock, CheckCircle, Flame, Calendar, MapPin, Phone, Heart, FileText, ArrowRight, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { Donation, User } from "../types";

interface PreviousDonationsProps {
  user: User;
  donations: Donation[];
  onNavigate: (tab: string) => void;
}

export default function PreviousDonations({ user, donations, onNavigate }: PreviousDonationsProps) {
  const [localDonations, setLocalDonations] = useState<Donation[]>(donations);

  React.useEffect(() => {
    setLocalDonations(donations);
  }, [donations]);

  const handleMarkAsCompleted = (donationId: string) => {
    setLocalDonations((prev) =>
      prev.map((d) =>
        d.id === donationId ? { ...d, status: "Completed" as const } : d
      )
    );
  };

  const totalKg = localDonations.reduce((acc, curr) => acc + curr.amount, 0);
  const totalServings = totalKg * 3;

  return (
    <div className="space-y-10">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-slate-950">Donation History</h2>
          <p className="text-slate-500 text-sm max-w-xl">
            Keep track of your active collections and historical feed statistics in Andhra Pradesh.
          </p>
        </div>

        {localDonations.length > 0 && (
          <div className="p-4 bg-emerald-600/5 border border-emerald-500/10 rounded-2xl flex items-center space-x-4">
            <div className="text-center shrink-0">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Fed</span>
              <span className="text-lg font-bold font-mono text-emerald-700">{totalServings} Meals</span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center shrink-0">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Gifted</span>
              <span className="text-lg font-bold font-mono text-amber-600">{totalKg} KGs</span>
            </div>
          </div>
        )}
      </div>

      {localDonations.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-600">
            <Clock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-bold text-slate-900">Your Donation Log is Clean</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
              We are preparing this portal fresh; there is no previous data. Get started by coordinating your very first meal donation with a local shelter!
            </p>
          </div>
          <button
            onClick={() => onNavigate("donation")}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center space-x-1.5"
          >
            <span>Coordinate Your First Delivery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl">
          {/* Timeline grid entries */}
          <div className="relative border-l border-slate-200/95 ml-3 sm:ml-4 pl-6 sm:pl-8 space-y-8">
            {localDonations.map((donation) => (
              <div key={donation.id} className="relative">
                {/* Timeline node selector marker icon */}
                <span className={`absolute -left-[35px] sm:-left-[41px] top-1.5 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center text-xs transition-all ${
                  donation.status === "Completed"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-amber-500 text-amber-600 animate-pulse"
                }`}>
                  {donation.status === "Completed" ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                </span>

                {/* Donation Card Box */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-xs select-text space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-400 font-mono">ID: {donation.id}</span>
                      <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{donation.timestamp}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        donation.foodType === "Veg"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}>
                        {donation.foodType}
                      </span>

                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        donation.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {donation.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                    {/* Shelter info */}
                    <div className="space-y-2">
                      <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-450">Destination Shelter</span>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-slate-800 text-sm">{donation.shelterName}</h4>
                        <div className="flex items-start text-xs text-slate-500 space-x-1.5 leading-snug">
                          <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                          <span>{donation.address}</span>
                        </div>
                        <div className="flex items-center text-xs text-slate-600 space-x-1.5 font-medium pt-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-emerald-700 font-semibold select-all">Direct Call: {donation.shelterPhone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Food Details */}
                    <div className="space-y-2">
                      <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-450">Donated Batch Details</span>
                      <div className="space-y-1">
                        <div className="text-slate-800 text-sm font-semibold">
                          {donation.amount} KGs of Food
                        </div>
                        <p className="text-slate-400 font-medium text-xs">
                          Equivalent to cooking approx. <strong className="text-slate-700">{donation.amount * 3} individual meals</strong> for the shelter.
                        </p>
                        <p className="text-slate-500 text-xs italic bg-slate-50 p-2 border border-slate-150 rounded-xl leading-relaxed mt-1">
                          "{donation.address}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Complete Action Button */}
                  {donation.status !== "Completed" && (
                    <div className="pt-2 border-t border-slate-100/80 flex justify-end">
                      <button
                        onClick={() => handleMarkAsCompleted(donation.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] py-2 px-4 rounded-xl flex items-center space-x-1 transition-all"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Deliver Completed? Check Out Here</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
