import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "data", "db.json");

// Ensure data directory and db.json file exist
function initDatabase() {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify({ users: [], donations: [] }, null, 2)
    );
  }
}

// Read database
function readDB() {
  try {
    initDatabase();
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Database read error:", error);
    return { users: [], donations: [] };
  }
}

// Write database
function writeDB(data: any) {
  try {
    initDatabase();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Database write error:", error);
  }
}

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Express Body Parsers
app.use(express.json());

// API Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Authentication: Register
app.post("/api/auth/register", (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  if (!name || !email || !phoneNumber || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const db = readDB();
  const existingUser = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ error: "User with this email already exists" });
  }

  const newUser = {
    id: `u_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    email,
    phoneNumber,
    password, // Store as is for simple simulation
    joinDate: new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };

  db.users.push(newUser);
  writeDB(db);

  // Exclude password in response
  const { password: _, ...userSafe } = newUser;
  res.status(201).json(userSafe);
});

// Authentication: Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const db = readDB();
  const user = db.users.find(
    (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const { password: _, ...userSafe } = user;
  res.json(userSafe);
});

// Donations: Log Donation
app.post("/api/donations/create", (req, res) => {
  const { userId, userName, address, city, amount, foodType, shelterId, shelterName, shelterPhone } = req.body;

  if (!userId || !userName || !address || !city || !amount || !foodType || !shelterId || !shelterName) {
    return res.status(400).json({ error: "Required donation fields missing" });
  }

  const db = readDB();
  const newDonation = {
    id: `d_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    userName,
    address,
    city,
    amount: Number(amount),
    foodType,
    shelterId,
    shelterName,
    shelterPhone: shelterPhone || "Not Available",
    timestamp: new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    status: "Pending Delivery",
  };

  db.donations.unshift(newDonation); // Add to the top of list
  writeDB(db);

  res.status(201).json(newDonation);
});

// Donations: Get Previous Donations for User
app.get("/api/donations/user/:userId", (req, res) => {
  const { userId } = req.params;
  const db = readDB();
  const userDonations = db.donations.filter((d: any) => d.userId === userId);
  res.json(userDonations);
});

// AI Analytics: Analyze how much quantity to cook
app.post("/api/analyze-cooking", async (req, res) => {
  const { members, mealType, items } = req.body;

  if (!members || !mealType || !items) {
    return res.status(400).json({ error: "Members, mealType and food items are required" });
  }

  const count = Number(members);
  const itemsText = String(items);

  // If Gemini Client is available, call it
  if (ai) {
    try {
      const prompt = `Calculate exact ingredient quantities to cook food for ${count} people.
Meal type: ${mealType}.
Food items to cook: ${itemsText}.
The application represents "MealBridge AI" designed for Andhra Pradesh context (spicing levels, local culinary names like Sona Masuri rice, locally sourced oils).
Provide a highly calculated, precise food recipe raw ingredient table, a portion size description, preparation guidelines, and specific waste minimization tips.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert Andhra Pradesh culinary advisor, institutional caterer, and food waste analyst. Your calculations must be highly specialized, accurate, and precise for bulk catering.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              portionsDescription: {
                type: Type.STRING,
                description: "Description of total prepared portion volume, e.g., 'This prepares approximately 25 kg of Veg Biryani offering ~350g serving per person.'"
              },
              ingredients: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Name of the raw ingredient" },
                    quantity: { type: Type.STRING, description: "Highly precise quantity with appropriate weight/liquid metric units (e.g. 12.5 kg, 500 grams, 3 liters)" }
                  },
                  required: ["name", "quantity"]
                }
              },
              instructions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Step-by-step key guidelines to cook in bulk safely and efficiently."
              },
              tipsForZeroWaste: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Andhra Pradesh custom tips to manage excess uncooked raw materials or preserve surplus cooked food."
              }
            },
            required: ["portionsDescription", "ingredients", "instructions", "tipsForZeroWaste"]
          }
        }
      });

      if (response && response.text) {
        const result = JSON.parse(response.text.trim());
        return res.json(result);
      }
    } catch (apiError) {
      console.error("Gemini API call failed, deploying local fallback:", apiError);
    }
  }

  // High-fidelity fallback quantity advisor if Gemini API is not accessible
  console.log("Using formula-based Institutional Catering Fallback for Quantity Analysis");
  
  // Basic heuristic list of items to guess recipe ingredients
  const lowercaseItems = itemsText.toLowerCase();
  
  let ingredientsList: Array<{ name: string; quantity: string }> = [];
  let portionsText = `Prepares institutional catering portions for ${count} persons for ${mealType}.`;
  let instructionsList: string[] = [
    `Wash all grains and vegetables in chlorinated / highly filtered water before starting prep.`,
    `Ensure bulk cooking vessels (Daari/Biryani Handi) are clean and dry.`,
    `Prepare spices early and measure precisely. Start charcoal, gas, or steam wood fire correctly.`,
    `Monitor core temperatures closely (must reach minimum 74°C) to prevent early spoilage.`
  ];
  let wasteTips: string[] = [
    `Use Sona Masuri raw rice or local Basmati according to exact measures. Proper moisture content control prevents mushy, wasted rice.`,
    `If surplus is cooked, pack it immediately into sanitized hot-pack insulated boxes to prolong safe temperature window.`,
    `Maintain standard serving spoons (e.g., 100g ladles) rather than self-service to avoid plate waste.`
  ];

  if (mealType === "Tiffin") {
    // Tiffin breakfast prep
    portionsText = `Prepares standard breakfast catering portions for ${count} persons. Average serving size of 200g - 250g per head.`;
    if (lowercaseItems.includes("idli")) {
      ingredientsList = [
        { name: "Sona Masuri Idli Rava", quantity: `${(count * 0.08).toFixed(2)} kg` },
        { name: "Urad Dal / Minappappu", quantity: `${(count * 0.04).toFixed(2)} kg` },
        { name: "Refined Salt", quantity: `${(count * 3).toFixed(0)} grams` },
        { name: "Ginger & Chiles (for chutney)", quantity: `${(count * 10).toFixed(0)} grams` },
        { name: "Toor Dal (for sambar)", quantity: `${(count * 0.02).toFixed(2)} kg` },
        { name: "Mixed Sambar Vegetables (Drumsticks, Pumpkin, Onions)", quantity: `${(count * 0.05).toFixed(2)} kg` },
        { name: "Tamarind / Chintapandu (for sambar)", quantity: `${(count * 5).toFixed(0)} grams` }
      ];
      instructionsList.push(`Soak Urad Dal for 4 hours; grind to a fluffy batter before mixing with soaked Idli Rava.`);
    } else if (lowercaseItems.includes("dosa")) {
      ingredientsList = [
        { name: "Raw Rice (Dosa quality)", quantity: `${(count * 0.1).toFixed(2)} kg` },
        { name: "Urad Dal / Minappappu", quantity: `${(count * 0.035).toFixed(2)} kg` },
        { name: "Refined Oil/Ghee", quantity: `${(count * 15).toFixed(0)} ml` },
        { name: "Red Onions & Chiles", quantity: `${(count * 0.02).toFixed(2)} kg` }
      ];
    } else if (lowercaseItems.includes("upma") || lowercaseItems.includes("ravva")) {
      ingredientsList = [
        { name: "Bombay Rava / Upma Ravva", quantity: `${(count * 0.08).toFixed(2)} kg` },
        { name: "Refined Oil", quantity: `${(count * 12).toFixed(0)} ml` },
        { name: "Mustard, Bengal Gram & Cashews", quantity: `${(count * 5).toFixed(0)} grams` },
        { name: "Chopped Onions, Carrots & Green Chillies", quantity: `${(count * 0.04).toFixed(2)} kg` }
      ];
    } else {
      // General breakfast fallback
      ingredientsList = [
        { name: "Raw Rice / Flour", quantity: `${(count * 0.09).toFixed(2)} kg` },
        { name: "Lentils / Dals", quantity: `${(count * 0.03).toFixed(2)} kg` },
        { name: "Cooking Oil", quantity: `${(count * 15).toFixed(0)} ml` },
        { name: "Regional AP spices & Salt", quantity: `${(count * 4).toFixed(0)} grams` }
      ];
    }
  } else {
    // Lunch or Dinner
    portionsText = `Prepares full meal institutional catering portions for ${count} persons for ${mealType}. Offers ~400g - 500g total plate weight per head.`;
    if (lowercaseItems.includes("biryani") || lowercaseItems.includes("pulao")) {
      ingredientsList = [
        { name: "Basmati / Sona Masuri Rice", quantity: `${(count * 0.15).toFixed(1)} kg` },
        { name: "Chicken / Mixed Vegetables (for gravy layer)", quantity: `${(count * 0.15).toFixed(1)} kg` },
        { name: "Ghee / Refined Oil", quantity: `${(count * 25).toFixed(0)} ml` },
        { name: "Red Onions (thinly sliced)", quantity: `${(count * 0.04).toFixed(2)} kg` },
        { name: "Tomatoes", quantity: `${(count * 0.025).toFixed(2)} kg` },
        { name: "Curd / Yogurt (for marinade & raita)", quantity: `${(count * 0.05).toFixed(2)} liters` },
        { name: "Biryani Whole Spices (Cardamom, Cloves, Shahi Jeera)", quantity: `${(count * 2).toFixed(0)} grams` },
        { name: "Ginger-Garlic Paste", quantity: `${(count * 6).toFixed(0)} grams` },
        { name: "Mint & Coriander Leaves", quantity: `${(count * 5).toFixed(0)} grams` }
      ];
      instructionsList.push(`Marinate protein/veggies in Curd, Ginger-Garlic paste, chili powder, and mint for at least 1 hour.`);
      instructionsList.push(`Parboil rice to exactly 70% in boiling salted water infused with whole spices before layering for Dum.`);
    } else {
      // Traditional South Indian full meal
      ingredientsList = [
        { name: "Sona Masuri Rice (Raw)", quantity: `${(count * 0.18).toFixed(1)} kg` },
        { name: "Toor Dal (Kandi Pappu for pappu/sambar)", quantity: `${(count * 0.05).toFixed(2)} kg` },
        { name: "Seasonal Vegetables (Gongura, Brinjal, Okra, Tomato)", quantity: `${(count * 0.12).toFixed(2)} kg` },
        { name: "Refined Cooking Oil", quantity: `${(count * 20).toFixed(0)} ml` },
        { name: "Tamarind Extract / Chintapakku", quantity: `${(count * 10).toFixed(0)} grams` },
        { name: "Rasam Powder & Regional Spices", quantity: `${(count * 4).toFixed(0)} grams` },
        { name: "Thick Curd / Perugu", quantity: `${(count * 0.08).toFixed(2)} liters` }
      ];
    }
  }

  res.json({
    portionsDescription: portionsText,
    ingredients: ingredientsList,
    instructions: instructionsList,
    tipsForZeroWaste: wasteTips
  });
});

// Setup Vite Dev server or Production static serving
async function startServer() {
  // Ensure database exists
  initDatabase();

  if (process.env.NODE_ENV !== "production") {
    // Vite Dev Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MealBridge AI Dev Server successfully started on http://0.0.0.0:${PORT}`);
  });
}

startServer();
