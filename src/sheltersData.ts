import { Shelter } from "./types";

export interface APCity {
  name: string;
  lat: number;
  lng: number;
}

export const AP_CITIES: APCity[] = [
  { name: "Vijayawada", lat: 16.5062, lng: 80.6480 },
  { name: "Visakhapatnam", lat: 17.6868, lng: 83.2185 },
  { name: "Guntur", lat: 16.3067, lng: 80.4365 },
  { name: "Nellore", lat: 14.4426, lng: 79.9865 },
  { name: "Kurnool", lat: 15.8281, lng: 78.0373 },
  { name: "Kakinada", lat: 16.9891, lng: 82.2439 },
  { name: "Tirupati", lat: 13.6284, lng: 79.4192 },
  { name: "Kadapa", lat: 14.4741, lng: 78.8241 },
  { name: "Anantapur", lat: 14.6819, lng: 77.6006 },
  { name: "Eluru", lat: 16.7114, lng: 81.1031 },
  { name: "Ongole", lat: 15.5057, lng: 80.0494 },
  { name: "Vizianagaram", lat: 18.1122, lng: 83.4055 },
  { name: "Rajamahendravaram", lat: 17.0005, lng: 81.7878 },
  { name: "Tenali", lat: 16.2433, lng: 80.6401 },
  { name: "Bhimavaram", lat: 16.5449, lng: 81.5226 },
  { name: "Chittoor", lat: 13.2172, lng: 79.1003 }
];

export const SHELTERS: Shelter[] = [
  {
    id: "s1",
    name: "Prema Samajamu Old Age Home & Orphanage",
    type: "Old Age Home",
    address: "Dabagardens, near Railway Station Road, Visakhapatnam, Andhra Pradesh",
    city: "Visakhapatnam",
    phone: "0891-2552431",
    lat: 17.7127,
    lng: 83.3087
  },
  {
    id: "s2",
    name: "Amma Nanna Anadha Asramam",
    type: "Anadhasrama",
    address: "Auto Nagar, Near Sai Temple, Vijayawada, Krishna District, Andhra Pradesh",
    city: "Vijayawada",
    phone: "9440333422",
    lat: 16.5062,
    lng: 80.6480
  },
  {
    id: "s3",
    name: "Sadhana Orphanage for Special Children",
    type: "Orphanage",
    address: "Gorantla, Inner Ring Road, Guntur, Andhra Pradesh",
    city: "Guntur",
    phone: "9949666012",
    lat: 16.3067,
    lng: 80.4365
  },
  {
    id: "s4",
    name: "Sri Sai Orphanage & Old Age Home",
    type: "Orphanage",
    address: "Bairagipatteda, Behind SV High School, Tirupati, Chittoor District, Andhra Pradesh",
    city: "Tirupati",
    phone: "9848521566",
    lat: 13.6284,
    lng: 79.4192
  },
  {
    id: "s5",
    name: "Mother Teresa Charitable Trust Orphanage & Home",
    type: "Anadhasrama",
    address: "Ramji Nagar, Opposite PSR Garden, Nellore, Andhra Pradesh",
    city: "Nellore",
    phone: "9441113224",
    lat: 14.4426,
    lng: 79.9865
  },
  {
    id: "s6",
    name: "Karuna Giri Old Age Home",
    type: "Old Age Home",
    address: "Yendada, Near Gitam College Road, Visakhapatnam, Andhra Pradesh",
    city: "Visakhapatnam",
    phone: "0891-2795412",
    lat: 17.7812,
    lng: 83.3510
  },
  {
    id: "s7",
    name: "Nirmal Hriday Old Age Home (Missionaries of Charity)",
    type: "Old Age Home",
    address: "Gunadala, Mary's Hill Road, Vijayawada, Andhra Pradesh",
    city: "Vijayawada",
    phone: "0866-2451255",
    lat: 16.5186,
    lng: 80.6698
  },
  {
    id: "s8",
    name: "Devaa Orphanage Home",
    type: "Orphanage",
    address: "Nallapadu Road, near Guntur Engineering College, Guntur, Andhra Pradesh",
    city: "Guntur",
    phone: "9177556011",
    lat: 16.2990,
    lng: 80.3990
  },
  {
    id: "s9",
    name: "Chaitanya Old Age Home",
    type: "Old Age Home",
    address: "Subhash Nagar, Behind Goutami School, Kakinada, East Godavari, Andhra Pradesh",
    city: "Kakinada",
    phone: "9866442110",
    lat: 16.9891,
    lng: 82.2439
  },
  {
    id: "s10",
    name: "Aashray Ananth Orphanage",
    type: "Orphanage",
    address: "Nandyal Road, Near Geetha Mandir, Kurnool, Andhra Pradesh",
    city: "Kurnool",
    phone: "9391334415",
    lat: 15.8281,
    lng: 78.0373
  },
  {
    id: "s11",
    name: "Sravani Old Age Home & Orphanage",
    type: "Old Age Home",
    address: "Yerramukkapalli, Rajiv Marg, Kadapa, Andhra Pradesh",
    city: "Kadapa",
    phone: "9000123456",
    lat: 14.4741,
    lng: 78.8241
  },
  {
    id: "s12",
    name: "Santhi Old Age Home",
    type: "Old Age Home",
    address: "Maruthi Nagar, Housing Board Colony, Anantapur, Andhra Pradesh",
    city: "Anantapur",
    phone: "9490123412",
    lat: 14.6819,
    lng: 77.6006
  },
  {
    id: "s13",
    name: "Spandana Orphans Shelter",
    type: "Orphanage",
    address: "Powerpet, 3rd street lane, Eluru, West Godavari District, Andhra Pradesh",
    city: "Eluru",
    phone: "9348123456",
    lat: 16.7114,
    lng: 81.1031
  },
  {
    id: "s14",
    name: "Blessing Hand Orphanage",
    type: "Orphanage",
    address: "Santhapet, Ring Road Junction, Ongole, Prakasam District, Andhra Pradesh",
    city: "Ongole",
    phone: "9849202122",
    lat: 15.5057,
    lng: 80.0494
  },
  {
    id: "s15",
    name: "Divya Jyothi Old Age Home",
    type: "Old Age Home",
    address: "Pradeep Nagar, Near BC Welfare Office, Vizianagaram, Andhra Pradesh",
    city: "Vizianagaram",
    phone: "08922-236125",
    lat: 18.1122,
    lng: 83.4055
  },
  {
    id: "s16",
    name: "Sneha Hastham Orphanage",
    type: "Orphanage",
    address: "Danavaipeta, Near Municipal Office, Rajamahendravaram, East Godavari, Andhra Pradesh",
    city: "Rajamahendravaram",
    phone: "9963212345",
    lat: 17.0005,
    lng: 81.7878
  },
  {
    id: "s17",
    name: "Aadarsha Orphan Home",
    type: "Orphanage",
    address: "Kattamanichi, RTC Depot Backside, Chittoor, Andhra Pradesh",
    city: "Chittoor",
    phone: "9440552312",
    lat: 13.2172,
    lng: 79.1003
  },
  {
    id: "s18",
    name: "Aaradhana Old Age Home",
    type: "Old Age Home",
    address: "J P Road, bypass junction, Bhimavaram, Andhra Pradesh",
    city: "Bhimavaram",
    phone: "9885112233",
    lat: 16.5449,
    lng: 81.5226
  },
  {
    id: "s19",
    name: "Amrutha Varshini Orphanage",
    type: "Orphanage",
    address: "Chenchupet, Market Road, Tenali, Guntur District, Andhra Pradesh",
    city: "Tenali",
    phone: "9848118811",
    lat: 16.2433,
    lng: 80.6401
  },
  {
    id: "s20",
    name: "Nitya Annadanam Old Age Home",
    type: "Old Age Home",
    address: "Kapila Theertham Road, Near Temple Ingress, Tirupati, Andhra Pradesh",
    city: "Tirupati",
    phone: "0877-2231234",
    lat: 13.6450,
    lng: 79.4250
  }
];

// Haversine formula to compute distance between two latitude/longitude points in kilometers
export function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth value radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // returns raw km
}

// Helper to deduce a city's latitude/longitude based on string content
export function resolveCoordsFromAddress(address: string): { city: string; lat: number; lng: number } {
  const normal = address.toLowerCase();
  for (const city of AP_CITIES) {
    if (normal.includes(city.name.toLowerCase())) {
      return { city: city.name, lat: city.lat, lng: city.lng };
    }
  }
  // Default to Vijayawada as the geographical midpoint
  return { city: "Vijayawada", lat: 16.5062, lng: 80.6480 };
}
