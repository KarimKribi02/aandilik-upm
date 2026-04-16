export type EquipmentCategory = "Earthmoving" | "Lifting" | "Concrete" | "Materials" | "Tools";
export type ReservationStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed" | "Rejected";
export type UserRole = "Client" | "Owner" | "Admin";

export interface Equipment {
  id: string;
  ownerId: string;
  name: string;
  category: EquipmentCategory;
  pricePerDay: number;
  location: string;
  availability: boolean;
  image: string;
  description: string;
  specs: { [key: string]: string };
  status: "active" | "pending" | "rejected";
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
  walletBalance?: number;
}

export interface Reservation {
  id: string;
  equipmentId: string;
  renterId: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  status: ReservationStatus;
  totalPrice: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: "Rental Income" | "Platform Fee" | "Deposit" | "Withdrawal";
  relatedId: string; // Reservation ID or other
  userId: string; // User who receives/pays
  counterparty: string;
  date: string;
  amount: number;
  status: "Cleared" | "Pending" | "Processing";
}

export const equipmentList: Equipment[] = [
  {
    id: "1",
    ownerId: "u1",
    name: "Caterpillar 320 Excavator",
    category: "Earthmoving",
    pricePerDay: 450,
    location: "Casablanca, Morocco",
    availability: true,
    image: "https://images.pexels.com/photos/1078850/pexels-photo-1078850.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "The Cat 320 Hydraulic Excavator brings increased efficiency and lower fuel and maintenance costs to your job site.",
    specs: {
      "Operating Weight": "22,500 kg",
      "Net Power": "117 kW",
      "Max Digging Depth": "6.72 m",
      "Bucket Capacity": "1.2 m³"
    },
    status: "active"
  },
  {
    id: "2",
    ownerId: "u1",
    name: "JCB 3CX Backhoe Loader",
    category: "Earthmoving",
    pricePerDay: 280,
    location: "Rabat, Morocco",
    availability: true,
    image: "https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "The JCB 3CX is the world's number one backhoe loader, designed to handle any construction task with ease.",
    specs: {
      "Operating Weight": "8,135 kg",
      "Standard Engine": "55 kW",
      "Max Depth": "4.24 m"
    },
    status: "active"
  },
  {
    id: "3",
    ownerId: "u4",
    name: "Manitou MRT 2550 Telehandler",
    category: "Lifting",
    pricePerDay: 520,
    location: "Tangier, Morocco",
    availability: false,
    image: "https://images.pexels.com/photos/1098935/pexels-photo-1098935.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Versatile rotating telehandler, ideal for construction and industrial applications where height and reach are critical.",
    specs: {
      "Lift Capacity": "4,999 kg",
      "Lift Height": "24.7 m",
      "Engine Power": "115 kW"
    },
    status: "active"
  },
  {
    id: "4",
    ownerId: "u4",
    name: "Putzmeister M38 Concrete Pump",
    category: "Concrete",
    pricePerDay: 850,
    location: "Marrakech, Morocco",
    availability: true,
    image: "https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "High-performance concrete pump for large architectural projects requiring precision and speed.",
    specs: {
      "Vertical Reach": "37.1 m",
      "Horizontal Reach": "32.8 m",
      "Output": "160 m³/h"
    },
    status: "active"
  },
  {
    id: "5",
    ownerId: "u1",
    name: "Liebherr LTM 1100 Mobile Crane",
    category: "Lifting",
    pricePerDay: 1200,
    location: "Casablanca, Morocco",
    availability: true,
    image: "https://images.pexels.com/photos/1231643/pexels-photo-1231643.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "A powerful all-terrain crane capable of lifting up to 100 tonnes with a 52-meter telescope boom.",
    specs: {
      "Max. Capacity": "100 t",
      "Telescopic Boom": "60 m",
      "Max. Hoist Height": "91 m"
    },
    status: "pending"
  }
];

export const users: User[] = [
  { id: "u1", name: "Ahmed Karim", role: "Owner", email: "ahmed@example.com", walletBalance: 15400 },
  { id: "u2", name: "Fatima Zohra", role: "Client", email: "fatima@example.com", walletBalance: 500 },
  { id: "u3", name: "System Admin", role: "Admin", email: "admin@example.com" },
  { id: "u4", name: "Hassan Ben", role: "Owner", email: "hassan@example.com", walletBalance: 8200 }
];

export const reservations: Reservation[] = [
  { 
    id: "r1", 
    equipmentId: "3", 
    renterId: "u2", 
    ownerId: "u4",
    startDate: "2026-04-15", 
    endDate: "2026-04-20", 
    status: "Confirmed",
    totalPrice: 2600,
    createdAt: "2026-04-01T10:00:00Z"
  },
  { 
    id: "r2", 
    equipmentId: "1", 
    renterId: "u2", 
    ownerId: "u1",
    startDate: "2026-04-12", 
    endDate: "2026-04-14", 
    status: "Pending",
    totalPrice: 900,
    createdAt: "2026-04-10T15:30:00Z"
  }
];

export const transactions: Transaction[] = [
  { id: "TX-1", type: "Rental Income", relatedId: "r1", userId: "u4", counterparty: "Fatima Zohra", date: "2026-04-12", amount: 2340, status: "Cleared" },
  { id: "TX-2", type: "Platform Fee", relatedId: "r1", userId: "u3", counterparty: "Manitou MRT", date: "2026-04-12", amount: 260, status: "Cleared" },
];

