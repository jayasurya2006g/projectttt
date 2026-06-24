export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  joinDate: string;
}

export interface Shelter {
  id: string;
  name: string;
  type: 'Old Age Home' | 'Orphanage' | 'Anadhasrama';
  address: string;
  city: string;
  phone: string;
  lat: number;
  lng: number;
}

export interface Donation {
  id: string;
  userId: string;
  userName: string;
  address: string;
  city: string;
  amount: number; // in kgs
  foodType: 'Veg' | 'Non-Veg';
  shelterId: string;
  shelterName: string;
  shelterPhone: string;
  timestamp: string;
  status: 'Pending Delivery' | 'Completed';
}

export interface AnalysisRequest {
  members: number;
  mealType: 'Tiffin' | 'Lunch' | 'Dinner';
  items: string;
}

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface CookingAnalysisResult {
  portionsDescription: string;
  ingredients: Ingredient[];
  instructions: string[];
  tipsForZeroWaste: string[];
}
