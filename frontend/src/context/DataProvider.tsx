"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  Equipment, 
  User, 
  Reservation, 
  Transaction,
  equipmentList as initialEquipment, 
  users as initialUsers, 
  reservations as initialReservations,
  transactions as initialTransactions
} from "@/data/mockData";
import { apiFetch } from "@/lib/api";

interface DataContextType {
  equipment: Equipment[];
  users: User[];
  reservations: Reservation[];
  transactions: Transaction[];
  currentUser: User | null;
  addEquipment: (item: Omit<Equipment, "id">) => Promise<void>;
  updateEquipment: (id: string, item: Partial<Equipment>) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
  addReservation: (reservation: Omit<Reservation, "id" | "createdAt" | "status">) => Promise<void>;
  updateReservationStatus: (id: string, status: Reservation["status"]) => Promise<void>;
  createUser: (name: string, email: string, password: string, role?: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, role: string, password?: string) => Promise<void>;
  logout: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mappings Backend (French) <-> Frontend (English)
const mapRole = (role: string): any => {
  if (!role) return role;
  const normalized = role.toLowerCase();
  
  // From backend to frontend
  if (normalized === 'administrateur') return 'Admin';
  if (normalized === 'propriétaire' || normalized === 'proprietaire' || normalized === 'owner') return 'Owner';
  if (normalized === 'client' || normalized === 'locataire') return 'Owner'; // fallback to Owner

  return role;
};

const mapRoleForBackend = (role: string): string => {
  if (!role) return 'propriétaire';
  const normalized = role.toLowerCase();
  if (normalized === 'admin') return 'administrateur';
  if (normalized === 'owner') return 'propriétaire';
  return 'propriétaire';
}

const mapStatus = (status: string): any => {
  if (!status) return 'Pending';
  const normalized = status.toLowerCase();
  if (normalized === 'en attente') return 'Pending';
  if (normalized === 'confirmée' || normalized === 'en cours') return 'Confirmed';
  if (normalized === 'terminée') return 'Completed';
  if (normalized === 'annulée') return 'Cancelled';
  if (normalized === 'pending') return 'en attente';
  if (normalized === 'confirmed') return 'confirmée';
  if (normalized === 'completed') return 'terminée';
  if (normalized === 'cancelled') return 'annulée';
  return 'Pending';
};

const transformEquipment = (item: any): Equipment => ({
  id: item.id.toString(),
  ownerId: item.proprietaire?.id?.toString() || "",
  name: item.nom_equipement,
  category: item.categorie as any,
  pricePerDay: item.prix_location,
  location: item.localisation,
  availability: true, // Typically calculated or fetched
  image: item.images || "https://images.pexels.com/photos/1078850/pexels-photo-1078850.jpeg?auto=compress&cs=tinysrgb&w=800",
  description: item.description,
  specs: {},
  status: "active"
});

const transformReservation = (item: any): Reservation => ({
  id: item.id.toString(),
  equipmentId: item.materiel?.id?.toString() || "",
  renterId: item.client?.id?.toString() || item.client_email || "", 
  ownerId: item.materiel?.proprietaire?.id?.toString() || "",
  startDate: new Date(item.date_debut).toISOString().split('T')[0],
  endDate: new Date(item.date_fin).toISOString().split('T')[0],
  status: mapStatus(item.statut),
  totalPrice: item.prix_total,
  createdAt: new Date().toISOString() // Backend lacks createdAt currently
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
            role: mapRole(userData.role),
            walletBalance: userData.solde_portefeuille || 0
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
              id: u.id.toString(), name: u.nom, email: u.email, role: mapRole(u.role), walletBalance: u.solde_portefeuille || 0
            })));
          }
        } catch (err) {
          console.error("Failed to restore session", err);
          localStorage.removeItem("aandilik_token");
          setEquipment([]);
          setUsers([]);
          setReservations([]);
          setTransactions([]);
          setCurrentUser(null);
        }
      } else {
        setEquipment([]);
        setUsers([]);
        setReservations([]);
        setTransactions([]);
        setCurrentUser(null);
      }
      setIsLoaded(true);
    };

    initApp();
  }, []);

  const login = async (email: string, password: string = "password123") => {
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      localStorage.setItem("aandilik_token", data.access_token);
      
      const userData = await apiFetch("/users/me");
      const user = {
        id: userData.id.toString(),
        name: userData.nom,
        email: userData.email,
        role: mapRole(userData.role),
        walletBalance: userData.solde_portefeuille || 0
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
          id: u.id.toString(), name: u.nom, email: u.email, role: mapRole(u.role), walletBalance: u.solde_portefeuille || 0
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
    setTransactions([]);
  };

  const addEquipment = async (item: Omit<Equipment, "id">) => {
    try {
      await apiFetch("/materiel", {
        method: "POST",
        body: JSON.stringify({
          nom_equipement: item.name,
          description: item.description,
          prix_location: item.pricePerDay,
          categorie: item.category,
          localisation: item.location,
          images: item.image
        })
      });
      
      const ownedEquipment = await apiFetch("/materiel/owner");
      setEquipment(ownedEquipment.map(transformEquipment));
    } catch (err) {
      console.error("Failed to add equipment", err);
      throw err;
    }
  };

  const updateEquipment = async (id: string, updates: Partial<Equipment>) => {
    try {
      await apiFetch(`/materiel/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          nom_equipement: updates.name,
          description: updates.description,
          prix_location: updates.pricePerDay,
          localisation: updates.location,
          images: updates.image
        })
      });
      const ownedEquipment = await apiFetch("/materiel/owner");
      setEquipment(ownedEquipment.map(transformEquipment));
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

  const addReservation = async (data: Omit<Reservation, "id" | "createdAt" | "status">) => {
    try {
      await apiFetch("/reservations", {
        method: "POST",
        body: JSON.stringify({
          materielId: parseInt(data.equipmentId),
          date_debut: data.startDate,
          date_fin: data.endDate
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
        body: JSON.stringify({ statut: mapStatus(status) })
      });
      
      if (currentUser?.role === 'Owner') {
        const ownedReservations = await apiFetch("/reservations/owner");
        setReservations(ownedReservations.map(transformReservation));
        
        // Refresh wallet
        const userData = await apiFetch("/users/me");
        setCurrentUser(prev => prev ? { ...prev, walletBalance: userData.solde_portefeuille } : null);
      }
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
        id: u.id.toString(), name: u.nom, email: u.email, role: mapRole(u.role), walletBalance: u.solde_portefeuille || 0
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


  return (
    <DataContext.Provider value={{
      equipment,
      users,
      reservations,
      transactions,
      currentUser,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      addReservation,
      updateReservationStatus,
      createUser,
      deleteUser,
      login,
      register,
      logout
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

