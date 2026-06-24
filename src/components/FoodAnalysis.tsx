import React, { useState } from "react";
import { Utensils, Sparkles, Scale, CheckSquare, ListOrdered, Leaf, Printer, Loader2, RefreshCw, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CookingAnalysisResult, Ingredient } from "../types";

export default function FoodAnalysis() {
  const [members, setMembers] = useState<number | "">("");
  const [mealType, setMealType] = useState<'Tiffin' | 'Lunch' | 'Dinner'>("Lunch");
  const [items, setItems] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CookingAnalysisResult | null>(null);
  const [error, setError] = useState("");

  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  const presetMenus = [
    {
      mealType: "Tiffin" as const,
      label: "Traditional Idli & Sambar",
      items: "Idli, Sambar, Coconut Chutney"
    },
    {
      mealType: "Lunch" as const,
      label: "Andhra Special Chicken Dum Biryani",
      items: "Chicken Dum Biryani, Onion Raita, Mirchi Ka Salan"
    },
    {
      mealType: "Lunch" as const,
      label: "Classic Andhra Pappu Bhojanam",
      items: "Steamed Rice, Gongura Pappu, Vankaya Fry, Majjiga (Buttermilk)"
    },
    {
      mealType: "Dinner" as const,
      label: "Light Chapati & Veg Kurma",
      items: "Chapati, Mixed Vegetable Kurma, Curd"
    }
  ];

  const handleApplyPreset = (preset: typeof presetMenus[0]) => {
    setMealType(preset.mealType);
    setItems(preset.items);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!members || !items.trim()) {
      alert("Please fill in both the number of members and food items.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setCheckedIngredients({});

    try {
      const response = await fetch("/api/analyze-cooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          members: Number(members),
          mealType,
          items,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze food quantities.");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check dev server connections.");
    } finally {
      setLoading(false);
    }
  };

  const toggleIngredient = (name: string) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-10">
      {/* Page Title Header */}
      <div className="space-y-2">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-slate-900">AI Quantity & Waste Advisor</h2>
        <p className="text-slate-500 text-sm max-w-2xl">
          Determine the exact raw ingredients and cooking volumes required for your event. Enter your target headcount, select your meal type, and describe the menu. Our advisor will give you scaled measures to minimize leftovers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left Input Panel */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Catering Scope</h3>
              <p className="text-slate-400 text-xs">Define what you want to cook</p>
            </div>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-5">
            {/* Number of Members Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Number of Members / Target Headcount
              </label>
              <input
                type="number"
                required
                min={1}
                value={members}
                onChange={(e) => setMembers(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="e.g. 100 people"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-mono font-medium"
              />
              <p className="mt-1 text-[10px] text-slate-400">
                Supports single small households up to large institutional banquets (1000+).
              </p>
            </div>

            {/* Meal Type selection cards */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Select Meal Type
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(["Tiffin", "Lunch", "Dinner"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMealType(type)}
                    className={`py-3 px-1 rounded-xl text-xs font-semibold border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                      mealType === type
                        ? "bg-amber-50 border-amber-500 text-amber-700 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>{type === "Tiffin" ? "🥞" : type === "Lunch" ? "🍱" : "🍲"}</span>
                    <span>{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Items Text list */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Food Items / Recipes to Prepare
              </label>
              <textarea
                required
                rows={3}
                value={items}
                onChange={(e) => setItems(e.target.value)}
                placeholder="e.g. Vegetable Pulav, Toor Pappu, Sambar, Onion Raita"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm py-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing quantities...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200 fill-current" />
                  <span>Calculate Scaling Ratios</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Predefined presets suggestions */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-[11px] font-bold text-slate-450 uppercase tracking-wider">AP Regional Menu Presets</h4>
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {presetMenus.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(preset)}
                  className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-[11px] text-left flex justify-between items-center transition-all group"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-700">{preset.label}</span>
                    <p className="text-slate-400 truncate max-w-[190px]">{preset.items}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-450 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-3 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 border border-red-100 text-xs rounded-2xl">
              <strong>Error analyzing ingredients: </strong> {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-3xl border border-slate-100 p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm min-h-[400px]"
              >
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 animate-pulse">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-slate-800 text-base">Configuring Recipe Matrix</h4>
                  <p className="text-slate-450 text-xs max-w-xs leading-relaxed mx-auto">
                    Retrieving exact ingredient portions from the MealBridge scaling advisor. Calculating water, weights, and spice densities.
                  </p>
                </div>
              </motion.div>
            ) : result ? (
              <motion.div
                key="recipe-output"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
                id="printable-recipe-sheet"
              >
                {/* Recipe Header Card */}
                <div className="bg-gradient-to-r from-amber-600/5 to-amber-700/5 p-6 sm:p-8 border-b border-slate-100 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="inline-flex items-center space-x-1.5 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        <Sparkles className="w-3 h-3 fill-current" />
                        <span>AI Kitchen Scaling Sheets</span>
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-slate-900">
                        Catering Blueprint for {members} Members
                      </h3>
                    </div>
                    {/* Print Recipe */}
                    <button
                      onClick={handlePrint}
                      className="p-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 transition-all select-none print:hidden flex items-center space-x-1.5 text-xs font-semibold"
                    >
                      <Printer className="w-4 h-4" />
                      <span className="hidden sm:inline">Print / Save Sheet</span>
                    </button>
                  </div>
                  
                  <p className="text-slate-650 text-xs sm:text-sm font-medium leading-relaxed italic bg-white p-3.5 border border-slate-100 rounded-2xl">
                    "{result.portionsDescription}"
                  </p>
                </div>

                {/* Recipe Blueprint Tabs */}
                <div className="p-6 sm:p-8 space-y-8">
                  {/* Grid layout for columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Ingredients Checklist Column */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                        <CheckSquare className="w-5 h-5 text-amber-600" />
                        <h4 className="font-semibold text-slate-800 text-sm sm:text-base">Raw Ingredients Checklist</h4>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Check off items as you verify inventory in your storage or kitchen:
                      </p>
                      
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {result.ingredients.map((ingredient, idx) => {
                          const isChecked = !!checkedIngredients[ingredient.name];
                          return (
                            <button
                              key={idx}
                              onClick={() => toggleIngredient(ingredient.name)}
                              className={`w-full p-3 rounded-xl border text-left flex justify-between items-center transition-all ${
                                isChecked
                                  ? "bg-slate-50 border-slate-200 opacity-60 line-through"
                                  : "bg-white border-slate-150 hover:bg-amber-500/[0.01]"
                              }`}
                            >
                              <div className="flex items-center space-x-3 pr-2 select-none">
                                <div className={`w-4 h-4 rounded border flex items-shrink-0 items-center justify-center transition-all ${
                                  isChecked ? "bg-amber-600 border-amber-600" : "border-slate-300 bg-white"
                                }`}>
                                  {isChecked && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                                </div>
                                <span className={`text-xs font-semibold ${isChecked ? "text-slate-400" : "text-slate-700"}`}>
                                  {ingredient.name}
                                </span>
                              </div>
                              <span className={`text-xs font-bold font-mono ${isChecked ? "text-slate-400" : "text-amber-700"}`}>
                                {ingredient.quantity}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step-by-Step scaling instructions */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                        <ListOrdered className="w-5 h-5 text-indigo-600" />
                        <h4 className="font-semibold text-slate-800 text-sm sm:text-base">Kitchen Guidelines</h4>
                      </div>
                      
                      <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                        {result.instructions.map((step, idx) => (
                          <div key={idx} className="p-3 bg-slate-50 rounded-xl flex items-start space-x-3 border border-slate-200/50">
                            <span className="w-5 h-5 bg-indigo-50 border border-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-bold font-mono text-[10px] flex-shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <p className="text-slate-600 text-xs leading-relaxed">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Zero Waste tips full-width footer card */}
                  <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5 sm:p-6 space-y-3">
                    <div className="flex items-center space-x-2 text-emerald-800">
                      <Leaf className="w-5 h-5 fill-emerald-100" />
                      <h4 className="font-semibold text-sm sm:text-base">Zero-Waste Sustainable Tips</h4>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.tipsForZeroWaste.map((tip, idx) => (
                        <li key={idx} className="bg-white p-3.5 border border-emerald-500/10 rounded-xl text-slate-650 text-xs leading-relaxed flex items-start space-x-1.5 shadow-xs">
                          <span className="text-emerald-600 font-bold mt-0.5">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 p-12 text-center h-full flex flex-col justify-center items-center space-y-4 min-h-[400px]">
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 border border-slate-100">
                  <Utensils className="w-7 h-7 text-slate-400" />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h4 className="font-semibold text-slate-800 text-base">Ingredient Scaling Blueprint</h4>
                  <p className="text-slate-450 text-xs leading-relaxed">
                    Once you request calculations, we will render a beautiful tailored ingredient checklist, instructions, and sustainability advice.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
