import React, { useState, useEffect } from "react";
import { MapPin, Search, Heart, Phone, HelpCircle, ArrowRight, CheckCircle, Flame, Sparkles, Loader2, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { User, Shelter, Donation } from "../types";
import { SHELTERS, AP_CITIES, calculateHaversineDistance, resolveCoordsFromAddress } from "../sheltersData";

interface DonationProps {
  user: User;
  onDonationCreated: () => void;
  onNavigate: (tab: string) => void;
}

interface ShelterWithDistance extends Shelter {
  distance: number;
  isWithinRadius: boolean;
}

export default function DonationComponent({ user, onDonationCreated, onNavigate }: DonationProps) {
  const [address, setAddress] = useState("");
  const [selectedCity, setSelectedCity] = useState("Vijayawada");
  const [amount, setAmount] = useState<number | "">("");
  const [foodType, setFoodType] = useState<'Veg' | 'Non-Veg'>("Veg");
  const [foodDescription, setFoodDescription] = useState("");
  
  const [showShelters, setShowShelters] = useState(false);
  const [shelterResults, setShelterResults] = useState<ShelterWithDistance[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [matchStatusMsg, setMatchStatusMsg] = useState("");

  const [activeShelterId, setActiveShelterId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [justCreatedDonation, setJustCreatedDonation] = useState<Donation | null>(null);

  // Sync city field if address is typed with predefined city name
  useEffect(() => {
    if (address.trim()) {
      const resolved = resolveCoordsFromAddress(address);
      if (resolved.city !== selectedCity) {
        setSelectedCity(resolved.city);
      }
    }
  }, [address]);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    // Auto-update address text box to showcase matching
    const currentCityObj = AP_CITIES.find(c => c.name === cityName);
    if (currentCityObj) {
      setAddress(`${cityName}, Andhra Pradesh`);
    }
  };

  const calculateShelterDistances = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !amount) {
      alert("Please fill in both your address and the food quantity model.");
      return;
    }

    // Resolve lat/long coords of current user session
    const homeCityObj = AP_CITIES.find((c) => c.name === selectedCity) || AP_CITIES[0];
    const userLat = homeCityObj.lat;
    const userLng = homeCityObj.lng;

    // Calculate distance to each of the 20 AP shelters
    const listings: ShelterWithDistance[] = SHELTERS.map((s) => {
      const dist = calculateHaversineDistance(userLat, userLng, s.lat, s.lng);
      return {
        ...s,
        distance: Number(dist.toFixed(1)),
        isWithinRadius: dist <= 50, // 50km matches user strict radius requirement
      };
    });

    // Sort by distance (ascending)
    listings.sort((a, b) => a.distance - b.distance);

    // Calculate counts for messaging
    const countWithin50 = listings.filter((s) => s.isWithinRadius).length;

    setShelterResults(listings);
    setShowShelters(true);
    setMatchStatusMsg(
      countWithin50 > 0
        ? `Successfully located ${countWithin50} shelters within a 50 km radius of ${selectedCity}.`
        : `No shelters found under 50 km from ${selectedCity}. Displaying closest available shelters across Andhra Pradesh.`
    );
  };

  const handleBookDonation = async (shelter: ShelterWithDistance) => {
    if (!amount) return;
    setSubmitting(true);
    setActiveShelterId(shelter.id);

    const donationPayload = {
      userId: user.id,
      userName: user.name,
      address,
      city: selectedCity,
      amount: Number(amount),
      foodType,
      shelterId: shelter.id,
      shelterName: shelter.name,
      shelterPhone: shelter.phone
    };

    try {
      const response = await fetch("/api/donations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donationPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to finalize donation coordination.");
      }

      setJustCreatedDonation(data);
      setShowSuccessModal(true);
      onDonationCreated(); // Trigger refresh on server state data
    } catch (err: any) {
      alert(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
      setActiveShelterId(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* Page Title Header */}
      <div className="space-y-2">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-slate-900">Food Donation Coordinates</h2>
        <p className="text-slate-500 text-sm max-w-2xl">
          Enter your location details and food quantities. MealBridge AI will search our consolidated database of 20 verified Andhra Pradesh old age homes, orphanages, and Anadhasramas to retrieve matches sorted precisely by geographical distance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Donation Form Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Donation Details</h3>
              <p className="text-slate-400 text-xs">Share what you would like to donate</p>
            </div>
          </div>

          <form onSubmit={calculateShelterDistances} className="space-y-5">
            {/* Quick District selection simulator */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Andhra Pradesh District/City Reference
              </label>
              <select
                value={selectedCity}
                onChange={handleCityChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all cursor-pointer"
              >
                {AP_CITIES.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name} Zone (Coords: {city.lat}°N, {city.lng}°E)
                  </option>
                ))}
              </select>
            </div>

            {/* Address Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Donor Address
              </label>
              <div className="relative">
                <span className="absolute top-3 left-3 text-slate-400">
                  <MapPin className="h-4.5 w-4.5" />
                </span>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Flat 301, DABAGARDENS, near Prema Samajam Main Gate, Visakhapatnam, Andhra Pradesh"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                />
              </div>
              <p className="mt-1 text-[10px] text-slate-400">
                Mention key landmarks in AP. If containing a city name, we will auto-resolve coordinates.
              </p>
            </div>

            {/* Food Amount in kgs */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Food Quantity Willing to Donate (approx KGs)
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 15 (calculates servings automatically)"
                  className="w-full pr-14 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                />
                <span className="absolute inset-y-0 right-4 flex items-center text-xs font-bold text-slate-400">
                  KGs
                </span>
              </div>
              {amount !== "" && (
                <p className="mt-1 text-[10px] text-emerald-600 font-medium">
                  ★ Feeding potential: Feeds approx. {amount * 3} people (averaging 350g serving).
                </p>
              )}
            </div>

            {/* Food Type Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Food Category
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFoodType("Veg")}
                  className={`py-3 px-4 rounded-xl text-sm font-semibold border flex items-center justify-center space-x-2 transition-all ${
                    foodType === "Veg"
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Pure Vegetarian</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFoodType("Non-Veg")}
                  className={`py-3 px-4 rounded-xl text-sm font-semibold border flex items-center justify-center space-x-2 transition-all ${
                    foodType === "Non-Veg"
                      ? "bg-red-50 border-red-500 text-red-700"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span>Non-Vegetarian</span>
                </button>
              </div>
            </div>

            {/* Description details */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Food Description / Menu (Optional)
              </label>
              <input
                type="text"
                value={foodDescription}
                onChange={(e) => setFoodDescription(e.target.value)}
                placeholder="e.g. Gongura Pappu, Steamed Sona Masuri Rice, Tomato Charu"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
              />
            </div>

            {/* Search Matchmaking Button */}
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm py-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Search & Sort AP Shelter Map</span>
            </button>
          </form>
        </div>

        {/* Shelter Matchlist Results Side */}
        <div className="lg:col-span-3 space-y-4">
          {!showShelters ? (
            <div className="bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 p-12 text-center h-full flex flex-col justify-center items-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-450 border border-slate-100">
                <MapPin className="w-7 h-7 text-slate-400" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h4 className="font-semibold text-slate-800 text-base">Retrieve Matching Shelters</h4>
                <p className="text-slate-450 text-xs leading-relaxed">
                  Fill in the donation form on the left. We will parse your coordinates in Andhra Pradesh and instantly yield nearby homes sorted by proximity.
                </p>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              {/* Radius Stat Banner */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/10 rounded-2xl text-xs text-amber-900 flex items-start space-x-2">
                <Info className="w-4.5 h-4.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Search Status: </strong> {matchStatusMsg} All distance benchmarks utilize coordinate projections relative to the primary <strong>{selectedCity}</strong> grid zone.
                </span>
              </div>

              {/* Shelter List Wrapper */}
              <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                {shelterResults.map((shelter) => {
                  const isPendingThis = activeShelterId === shelter.id;
                  
                  return (
                    <div
                      key={shelter.id}
                      className={`bg-white rounded-2xl border p-5 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4 ${
                        shelter.isWithinRadius
                          ? "border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-md hover:shadow-emerald-500/[0.02]"
                          : "border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            shelter.type === "Old Age Home"
                              ? "bg-indigo-50 text-indigo-700"
                              : shelter.type === "Orphanage"
                              ? "bg-pink-50 text-pink-700"
                              : "bg-amber-50 text-amber-700"
                          }`}>
                            {shelter.type}
                          </span>
                          
                          {/* Distance Badge */}
                          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                            shelter.isWithinRadius
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}>
                            {shelter.distance === 0 ? "Under 1 km" : `${shelter.distance} km away`}
                          </span>

                          {shelter.isWithinRadius && (
                            <span className="text-[10px] font-semibold bg-emerald-600 text-white px-2.5 py-1 rounded-full">
                              Within 50km Radius
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="font-semibold text-slate-800 text-sm sm:text-base">{shelter.name}</h4>
                          <p className="text-slate-500 text-xs mt-1 leading-snug">{shelter.address}</p>
                        </div>

                        {/* Contact details */}
                        <div className="flex items-center text-xs font-semibold text-slate-700 space-x-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>Contact: {shelter.phone}</span>
                        </div>
                      </div>

                      {/* Connect Action Button */}
                      <div className="flex-shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleBookDonation(shelter)}
                          disabled={submitting}
                          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                            shelter.isWithinRadius
                              ? "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md"
                              : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                          }`}
                        >
                          {isPendingThis ? (
                            <Loader2 className="w-4.5 h-4.5 animate-spin" />
                          ) : (
                            <>
                              <Heart className="w-3.5 h-3.5" />
                              <span>Connect & Donate</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Success Modal / Backdrop */}
      <AnimatePresence>
        {showSuccessModal && justCreatedDonation && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 text-center border border-slate-100"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-slate-900">Donation Saved Successfully</h3>
                <p className="text-slate-500 text-xs">
                  Your donation request has been recorded. Let's arrange pickup!
                </p>
              </div>

              {/* Receipt details */}
              <div className="bg-slate-50 rounded-2xl p-5 text-left text-xs space-y-3.5 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-450 font-medium">To Shelter:</span>
                  <span className="text-slate-800 font-bold">{justCreatedDonation.shelterName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450 font-medium">Phone / Contact:</span>
                  <span className="text-emerald-700 font-bold select-all flex items-center space-x-1">
                    <Phone className="w-3 h-3 flex-shrink-0" />
                    <span>{justCreatedDonation.shelterPhone}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450 font-medium">Donor Location:</span>
                  <span className="text-slate-700 text-right font-medium truncate max-w-[200px]">{justCreatedDonation.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450 font-medium">Food Quantity:</span>
                  <span className="text-amber-700 font-bold">{justCreatedDonation.amount} KG (~{justCreatedDonation.amount * 3} servings)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450 font-medium">Type:</span>
                  <span className={`font-semibold ${justCreatedDonation.foodType === "Veg" ? "text-emerald-600" : "text-red-600"}`}>
                    {justCreatedDonation.foodType}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-left text-xs leading-relaxed border border-emerald-100">
                <strong>Next Step: </strong> Call the shelter coordinator at the phone number displayed above. Inform them that you have packaged active surplus food and align whether they will send a vehicle or if you will drop it off.
              </div>

              <div className="flex space-x-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-xl text-xs font-bold transition-all"
                >
                  Close & Done
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSuccessModal(false);
                    onNavigate("history");
                  }}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1"
                >
                  <span>Go to History</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
