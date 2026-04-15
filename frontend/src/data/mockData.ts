export interface Equipment {
  id: string;
  name: string;
  category: "Earthmoving" | "Lifting" | "Concrete" | "Materials" | "Tools";
  pricePerDay: number;
  location: string;
  availability: boolean;
  image: string;
  description: string;
  specs: { [key: string]: string };
}

export const equipmentList: Equipment[] = [
  {
    id: "1",
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
    }
  },
  {
    id: "2",
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
    }
  },
  {
    id: "3",
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
    }
  },
  {
    id: "4",
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
    }
  }
];

export const users = [
  { id: "u1", name: "Ahmed Karim", role: "Owner", email: "ahmed@example.com" },
  { id: "u2", name: "Fatima Zohra", role: "Renter", email: "fatima@example.com" },
  { id: "u3", name: "Khalid Ben", role: "Admin", email: "admin@example.com" }
];

export const reservations = [
  { id: "r1", equipmentId: "3", renterId: "u2", startDate: "2026-04-15", endDate: "2026-04-20", status: "Confirmed" },
  { id: "r2", equipmentId: "1", renterId: "u2", startDate: "2026-04-12", endDate: "2026-04-14", status: "Pending" }
];
