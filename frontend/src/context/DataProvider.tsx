"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  Equipment, 
  User, 
  Reservation, 
  // equipmentList as initialEquipment, 
  // users as initialUsers, 
  // reservations as initialReservations,
  Article,
  Partner,
  EquipmentCategory,
  ReservationStatus,
  UserRole
} from "@/data/mockData";
import { apiFetch } from "@/lib/api";
import { getAllTrackedReservations, updateTrackedStatus } from "@/lib/tracking";

export interface Expert {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
}

interface DataContextType {
  equipment: Equipment[];
  users: User[];
  reservations: Reservation[];
  articles: Article[];
  partners: Partner[];
  experts: Expert[];
  categories: Category[];
  currentUser: User | null;
  addEquipment: (item: Omit<Equipment, "id">) => Promise<void>;
  updateEquipment: (id: string, item: Partial<Equipment>) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
  addReservation: (reservation: Omit<Reservation, "id" | "createdAt" | "status">) => Promise<void>;
  updateReservationStatus: (id: string, status: Reservation["status"]) => Promise<void>;
  addArticle: (data: Omit<Article, "id" | "createdAt">) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  addPartner: (data: { name: string; logo: string }) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;
  addExpert: (data: { name: string; role: string; image: string }) => Promise<void>;
  deleteExpert: (id: string) => Promise<void>;
  createUser: (name: string, email: string, password: string, role?: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, role: string, password?: string) => Promise<void>;
  logout: () => void;
  addDemand: (data: any) => Promise<void>;
  addCategory: (data: Omit<Category, "id">) => Promise<void>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mappings Backend (French) <-> Frontend (English)
const mapRole = (role: string): UserRole => {
  if (!role) return 'Owner';
  const normalized = role.toLowerCase().trim();
  
  // From backend to frontend
  if (normalized.includes('admin')) return 'Admin';
  if (normalized.includes('propri') || normalized.includes('owner') || normalized === 'client' || normalized === 'locataire') return 'Owner';

  return 'Owner'; // default fallback
};

const mapRoleForBackend = (role: string): string => {
  if (!role) return 'propriétaire';
  const normalized = role.toLowerCase();
  if (normalized === 'admin') return 'administrateur';
  if (normalized === 'owner') return 'propriétaire';
  return 'propriétaire';
};

const mapStatusForBackend = (status: string): string => {
  const s = status.toLowerCase();
  if (s === 'pending') return 'en attente';
  if (s === 'confirmed') return 'confirmée';
  if (s === 'in progress' || s === 'in-progress') return 'en cours';
  if (s === 'completed') return 'terminée';
  if (s === 'cancelled') return 'annulée';
  return 'en attente';
};

const mapStatus = (status: string): ReservationStatus => {
  if (!status) return 'Pending';
  const normalized = status.toLowerCase();
  
  if (normalized === 'en attente' || normalized === 'pending') return 'Pending';
  if (normalized === 'confirmée' || normalized === 'confirmed') return 'Confirmed';
  if (normalized === 'en cours' || normalized === 'in progress' || normalized === 'in-progress') return 'In Progress';
  if (normalized === 'terminée' || normalized === 'completed') return 'Completed';
  if (normalized === 'annulée' || normalized === 'cancelled') return 'Cancelled';
  if (normalized === 'rejected' || normalized === 'rejetée') return 'Rejected';
  
  return 'Pending';
};

const transformEquipment = (item: any): Equipment => {
  const rawImage = (item.images || item.image || "") as string;
  const isValidImage = rawImage && 
                      rawImage !== "null" && 
                      rawImage !== "undefined" && 
                      rawImage.length > 10;

  const imageUrl = isValidImage 
    ? rawImage 
    : "https://images.pexels.com/photos/1078850/pexels-photo-1078850.jpeg?auto=compress&cs=tinysrgb&w=800";

  return {
    id: item.id.toString(),
    ownerId: item.proprietaire?.id?.toString() || "",
    name: item.nom_equipement,
    category: (item.categorie || "Earthmoving") as EquipmentCategory,
    pricePerDay: item.prix_location,
    location: item.localisation,
    availability: true, 
    image: imageUrl,
    description: item.description,
    specs: {},
    status: (item.status === 'active' || item.status === 'pending' || item.status === 'rejected' ? item.status : "pending") as any,
    poids_operationnel: item.poids_operationnel,
    capacite_godet: item.capacite_godet
  };
};

const transformReservation = (item: any): Reservation => ({
  id: item.id.toString(),
  equipmentId: item.materiel?.id?.toString() || "",
  renterId: item.client?.id?.toString() || item.client_email || "", 
  ownerId: item.materiel?.proprietaire?.id?.toString() || "",
  startDate: new Date(item.date_debut).toISOString().split('T')[0],
  endDate: new Date(item.date_fin).toISOString().split('T')[0],
  status: mapStatus(item.statut || item.status),
  totalPrice: item.prix_total,
  createdAt: new Date().toISOString(), // Backend lacks createdAt currently
  client_nom: item.client_nom,
  client_telephone: item.client_telephone,
  client_email: item.client_email
});

const transformArticle = (item: any): Article => ({
  id: item.id.toString(),
  title: item.title,
  content: item.content,
  category: item.category,
  image: item.image,
  createdAt: item.createdAt
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initial Data Fetch
  useEffect(() => {
    const initApp = async () => {
      const token = localStorage.getItem("aandilik_token");
      if (token) {
        try {
          const userData = await apiFetch("/users/me");
          const user: User = {
            id: userData.id.toString(),
            name: userData.nom,
            email: userData.email,
            role: mapRole(userData.role)
          };
          setCurrentUser(user);

          // Load all equipment for marketplace + dashboard filtering
          const allEquipment = await apiFetch("/materiel");
          setEquipment(allEquipment.map(transformEquipment));

          if (user.role === 'Admin') {
            const allUsers = await apiFetch("/users");
            setUsers(allUsers.map((u: any) => ({
              id: u.id.toString(), name: u.nom, email: u.email, role: mapRole(u.role)
            })));
            const allReservations = await apiFetch("/reservations");
            setReservations(allReservations.map(transformReservation));
          } else if (user.role === 'Owner') {
            const myReservations = await apiFetch("/reservations/owner");
            setReservations(myReservations.map(transformReservation));
          } else {
            const myReservations = await apiFetch("/reservations/me");
            setReservations(myReservations.map(transformReservation));
          }
        } catch (err) {
          console.error("Failed to restore session", err);
          localStorage.removeItem("aandilik_token");
          setEquipment([]);
          setUsers([]);
          setReservations([]);
          setArticles([]);
          setCurrentUser(null);
        }
      } else {
        // No token: load public equipment listing for unauthenticated visitors
        try {
          const publicEquipment = await apiFetch("/materiel");
          setEquipment(publicEquipment.map(transformEquipment));
        } catch (err) {
          console.error("Failed to fetch public equipment", err);
          setEquipment([]);
        }
        setUsers([]);
        setReservations([]);
        setArticles([]);
        setCurrentUser(null);
      }

      // Always load articles, partners & categories publicly
      try {
        const [publicArticles, publicPartners, publicCategories] = await Promise.all([
          apiFetch("/blog"),
          apiFetch("/partners"),
          apiFetch("/categories")
        ]);
        setArticles(publicArticles.map(transformArticle));
        setPartners(publicPartners.map((p: any): Partner => ({
          id: p.id.toString(),
          name: p.name,
          logo: p.logo || "",
          createdAt: p.createdAt || ""
        })));
        setCategories(publicCategories.map((c: any) => ({
          ...c,
          id: c.id.toString()
        })));
      } catch (err) {
        console.error("Failed to fetch shared public data", err);
      }

      try {
        const expertsData = await apiFetch("/experts");
        setExperts(expertsData.map((e: any): Expert => ({
          id: e.id.toString(),
          name: e.name,
          role: e.role,
          image: e.image || ""
        })));
      } catch (err) {
        console.error("Failed to fetch experts", err);
      }

      setIsLoaded(true);
    };

    initApp();
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      const { access_token } = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      localStorage.setItem("aandilik_token", access_token);
      
      const userData = await apiFetch("/users/me");
      const user: User = {
        id: userData.id.toString(),
        name: userData.nom,
        email: userData.email,
        role: mapRole(userData.role)
      };
      
      setCurrentUser(user);
      
      if (user.role === 'Owner') {
        const ownedEquipment = await apiFetch("/materiel/owner");
        setEquipment(ownedEquipment.map(transformEquipment));
        const ownedReservations = await apiFetch("/reservations/owner");
        setReservations(ownedReservations.map(transformReservation));
      } else if (user.role === 'Admin') {
        const allEquipment = await apiFetch("/materiel");
        setEquipment(allEquipment.map(transformEquipment));
        const allReservations = await apiFetch("/reservations");
        setReservations(allReservations.map(transformReservation));
        const allUsers = await apiFetch("/users");
        setUsers(allUsers.map((u: any) => ({
          id: u.id.toString(), name: u.nom, email: u.email, role: mapRole(u.role)
        })));
      }

      return true;
    } catch (err) {
      console.error("Login failed", err);
      return false;
    }
  };

  const register = async (name: string, email: string, role: string, password: string = "password123") => {
    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          nom: name,
          email,
          password: password,
          role: mapRoleForBackend(role)
        })
      });
      await login(email, password);
    } catch (err) {
      console.error("Registration failed", err);
      throw err;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("aandilik_token");
    setEquipment([]);
    setUsers([]);
    setReservations([]);
  };

  const addEquipment = async (item: any) => {
    try {
      const response = await apiFetch("/materiel", {
        method: "POST",
        body: JSON.stringify({
          nom_equipement: item.name,
          description: item.description,
          prix_location: item.pricePerDay,
          categorie: item.category,
          localisation: item.location,
          images: item.image,
          poids_operationnel: item.poids_operationnel,
          capacite_godet: item.capacite_godet,
          status: item.status || "pending"
        })
      });
      
      const newEquip = transformEquipment(response);
      setEquipment(prev => [...prev, newEquip]);
    } catch (err) {
      console.error("Failed to add equipment", err);
      throw err;
    }
  };

  const updateEquipment = async (id: string, updates: Partial<Equipment>) => {
    try {
      const response = await apiFetch(`/materiel/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          nom_equipement: updates.name,
          description: updates.description,
          prix_location: updates.pricePerDay,
          localisation: updates.location,
          images: updates.image,
          status: updates.status,
          poids_operationnel: updates.poids_operationnel,
          capacite_godet: updates.capacite_godet
        })
      });
      
      const updatedItem = transformEquipment(response);
      setEquipment(prev => prev.map(item => item.id === id ? updatedItem : item));
    } catch (err) {
      console.error("Failed to update equipment", err);
      throw err;
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      await apiFetch(`/materiel/${id}`, { method: "DELETE" });
      setEquipment(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to delete equipment", err);
      throw err;
    }
  };

  const addReservation = async (data: any) => {
    try {
      await apiFetch("/reservations", {
        method: "POST",
        body: JSON.stringify({
          materielId: parseInt(data.equipmentId || data.materielId),
          date_debut: data.startDate || data.date_debut,
          date_fin: data.endDate || data.date_fin,
          client_nom: data.client_nom,
          client_email: data.client_email,
          client_telephone: data.client_telephone,
          tracking_code: data.tracking_code
        })
      });
      
      const ownerReservations = await apiFetch("/reservations/owner");
      setReservations(ownerReservations.map(transformReservation));
    } catch (err) {
      console.error("Failed to add reservation", err);
      throw err;
    }
  };

  const updateReservationStatus = async (id: string, status: Reservation["status"]) => {
    try {
      await apiFetch(`/reservations/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ statut: mapStatusForBackend(status) })
      });
      
      // Update local tracking state if it exists
      const resData = reservations.find(r => r.id === id);
      if (resData) {
        const allTracked = getAllTrackedReservations();
        const tracked = Object.values(allTracked).find(t => 
          t.clientEmail === resData.renterId || t.startDate === resData.startDate
        );
        if (tracked) {
          // Reject is not handled in tracking UI, map it to Cancelled
          const trackingStatus = status === "Rejected" ? "Cancelled" : status as any;
          updateTrackedStatus(tracked.trackingCode, trackingStatus);
        }
      }

      const allRes = await apiFetch("/reservations");
      setReservations(allRes.map(transformReservation));
    } catch (err) {
      console.error("Failed to update reservation status", err);
      throw err;
    }
  };

  const createUser = async (name: string, email: string, password: string, role: string = "propri\u00e9taire") => {
    try {
      await apiFetch("/users", {
        method: "POST",
        body: JSON.stringify({
          nom: name,
          email,
          password,
          role: mapRoleForBackend(role)
        })
      });
      // Refresh users list
      const allUsers = await apiFetch("/users");
      setUsers(allUsers.map((u: any) => ({
        id: u.id.toString(), name: u.nom, email: u.email, role: mapRole(u.role)
      })));
    } catch (err) {
      console.error("Failed to create user", err);
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await apiFetch(`/users/${id}`, { method: "DELETE" });
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error("Failed to delete user", err);
      throw err;
    }
  };

  const addArticle = async (data: Omit<Article, "id" | "createdAt">) => {
    try {
      await apiFetch("/blog", {
        method: "POST",
        body: JSON.stringify(data)
      });
      const blogData = await apiFetch("/blog");
      setArticles(blogData.map(transformArticle));
    } catch (err) {
      console.error("Failed to add article", err);
      throw err;
    }
  };

  const deleteArticle = async (id: string) => {
    try {
      await apiFetch(`/blog/${id}`, { method: "DELETE" });
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error("Failed to delete article", err);
      throw err;
    }
  };


  const addPartner = async (data: { name: string; logo: string }) => {
    try {
      await apiFetch("/partners", {
        method: "POST",
        body: JSON.stringify(data)
      });
      const partnersData = await apiFetch("/partners");
      setPartners(partnersData.map((p: any): Partner => ({
        id: p.id.toString(),
        name: p.name,
        logo: p.logo || "",
        createdAt: p.createdAt || ""
      })));
    } catch (err) {
      console.error("Failed to add partner", err);
      throw err;
    }
  };

  const deletePartner = async (id: string) => {
    try {
      await apiFetch(`/partners/${id}`, { method: "DELETE" });
      setPartners(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Failed to delete partner", err);
      throw err;
    }
  };

  const addExpert = async (data: { name: string; role: string; image: string }) => {
    try {
      await apiFetch("/experts", {
        method: "POST",
        body: JSON.stringify(data)
      });
      const expertsData = await apiFetch("/experts");
      setExperts(expertsData.map((e: any): Expert => ({
        id: e.id.toString(),
        name: e.name,
        role: e.role,
        image: e.image || ""
      })));
    } catch (err) {
      console.error("Failed to add expert", err);
      throw err;
    }
  };

  const deleteExpert = async (id: string) => {
    try {
      await apiFetch(`/experts/${id}`, { method: "DELETE" });
      setExperts(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error("Failed to delete expert", err);
      throw err;
    }
  };

  const addDemand = async (data: any) => {
    try {
      await apiFetch("/demands", {
        method: "POST",
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.error("Failed to add demand", err);
      throw err;
    }
  };

  const addCategory = async (data: Omit<Category, "id">) => {
    try {
      const newCat = await apiFetch("/categories", {
        method: "POST",
        body: JSON.stringify(data)
      });
      setCategories(prev => [...prev, { ...newCat, id: newCat.id.toString() }]);
    } catch (err) {
      console.error("Failed to add category", err);
      throw err;
    }
  };

  const updateCategory = async (id: string, data: Partial<Category>) => {
    try {
      const updatedCat = await apiFetch(`/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
      });
      setCategories(prev => prev.map(cat => cat.id === id ? { ...updatedCat, id: updatedCat.id.toString() } : cat));
    } catch (err) {
      console.error("Failed to update category", err);
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await apiFetch(`/categories/${id}`, {
        method: "DELETE"
      });
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      console.error("Failed to delete category", err);
      throw err;
    }
  };


  return (
    <DataContext.Provider value={{
      equipment,
      users,
      reservations,
      articles,
      partners,
      experts,
      categories,
      currentUser,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      addReservation,
      updateReservationStatus,
      addArticle,
      deleteArticle,
      addPartner,
      deletePartner,
      addExpert,
      deleteExpert,
      createUser,
      deleteUser,
      login,
      register,
      logout,
      addDemand,
      addCategory,
      updateCategory,
      deleteCategory
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
