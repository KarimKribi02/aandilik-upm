export type EquipmentCategory = "Earthmoving" | "Lifting" | "Concrete" | "Materials" | "Tools";
export type ReservationStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed" | "Rejected" | "In Progress";
export type UserRole = "Owner" | "Admin";

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
  status: "active" | "pending" | "rejected" | "inactive" | "maintenance";
  poids_operationnel?: number;
  capacite_godet?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
  telephone?: string;
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
  client_nom?: string;
  client_telephone?: string;
  client_email?: string;
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
  { id: "u1", name: "Ahmed Karim", role: "Owner", email: "ahmed@example.com" },
  { id: "u3", name: "System Admin", role: "Admin", email: "admin@example.com" },
  { id: "u4", name: "Hassan Ben", role: "Owner", email: "hassan@example.com" }
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


export interface Partner {
  id: string;
  name: string;
  logo: string;
  createdAt: string;
}

export const mockPartners: Partner[] = [
  { id: "p1", name: "CAT", logo: "", createdAt: "" },
  { id: "p2", name: "KOMATSU", logo: "", createdAt: "" },
  { id: "p3", name: "VOLVO", logo: "", createdAt: "" },
  { id: "p4", name: "DOOSAN", logo: "", createdAt: "" },
  { id: "p5", name: "HITACHI", logo: "", createdAt: "" },
  { id: "p6", name: "JCB", logo: "", createdAt: "" },
  { id: "p7", name: "LIEBHERR", logo: "", createdAt: "" },
];

export interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  image: string;
  createdAt: string;
}

export const mockArticles: Article[] = [
  {
    id: "1",
    category: "CONSEILS",
    createdAt: "2024-05-12T10:00:00Z",
    title: "Comment choisir le bon engin pour votre chantier ?",
    content: "Nos experts vous donnent les clés pour choisir le matériel adapté à vos besoins.",
    image: "https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "2",
    category: "SÉCURITÉ",
    createdAt: "2024-04-28T10:00:00Z",
    title: "Sécurité sur chantier : les bonnes pratiques à adopter",
    content: "Les règles essentielles pour assurer la sécurité de vos équipes et de vos équipements.",
    image: "https://images.pexels.com/photos/2209529/pexels-photo-2209529.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "3",
    category: "GUIDE",
    createdAt: "2024-04-15T10:00:00Z",
    title: "Les avantages de la location de matériel lourd",
    content: "Pourquoi la location est la solution la plus rentable pour vos projets.",
    image: "https://images.pexels.com/photos/1078850/pexels-photo-1078850.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
];
