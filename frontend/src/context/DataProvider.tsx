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

interface DataContextType {
  equipment: Equipment[];
  users: User[];
  reservations: Reservation[];
  transactions: Transaction[];
  currentUser: User | null;
  addEquipment: (item: Omit<Equipment, "id">) => void;
  updateEquipment: (id: string, item: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  addReservation: (reservation: Omit<Reservation, "id" | "createdAt" | "status">) => void;
  updateReservationStatus: (id: string, status: Reservation["status"]) => void;
  login: (email: string) => boolean;
  register: (name: string, email: string, role: string) => void;
  logout: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage or use defaults
  useEffect(() => {
    const savedEquipment = localStorage.getItem("aandilik_equipment");
    const savedUsers = localStorage.getItem("aandilik_users");
    const savedReservations = localStorage.getItem("aandilik_reservations");
    const savedTransactions = localStorage.getItem("aandilik_transactions");
    const savedUser = localStorage.getItem("aandilik_current_user");

    setEquipment(savedEquipment ? JSON.parse(savedEquipment) : initialEquipment);
    setUsers(savedUsers ? JSON.parse(savedUsers) : initialUsers);
    setReservations(savedReservations ? JSON.parse(savedReservations) : initialReservations);
    setTransactions(savedTransactions ? JSON.parse(savedTransactions) : initialTransactions);
    setCurrentUser(savedUser ? JSON.parse(savedUser) : null);
    setIsLoaded(true);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("aandilik_equipment", JSON.stringify(equipment));
      localStorage.setItem("aandilik_users", JSON.stringify(users));
      localStorage.setItem("aandilik_reservations", JSON.stringify(reservations));
      localStorage.setItem("aandilik_transactions", JSON.stringify(transactions));
    }
  }, [equipment, users, reservations, transactions, isLoaded]);

  const login = (email: string) => {
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem("aandilik_current_user", JSON.stringify(user));
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, role: any) => {
    const newUser: User = {
      id: "u_" + Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      walletBalance: 0
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    localStorage.setItem("aandilik_current_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("aandilik_current_user");
  };

  const addEquipment = (item: Omit<Equipment, "id">) => {
    const newEquipment: Equipment = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
    };
    setEquipment(prev => [...prev, newEquipment]);
  };

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setEquipment(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteEquipment = (id: string) => {
    setEquipment(prev => prev.filter(item => item.id !== id));
  };

  const addReservation = (data: Omit<Reservation, "id" | "createdAt" | "status">) => {
    const newReservation: Reservation = {
      ...data,
      id: "res_" + Math.random().toString(36).substr(2, 9),
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    setReservations(prev => [newReservation, ...prev]);
  };

  const updateReservationStatus = (id: string, status: Reservation["status"]) => {
    setReservations(prev => {
      const updated = prev.map(res => res.id === id ? { ...res, status } : res);
      
      // If confirmed, generate transactions
      if (status === "Confirmed") {
        const res = updated.find(r => r.id === id);
        if (res) {
          const ownerAmount = res.totalPrice * 0.9;
          const platformFee = res.totalPrice * 0.1;
          const equipmentName = equipment.find(e => e.id === res.equipmentId)?.name || "Industrial machinery";
          const renterName = users.find(u => u.id === res.renterId)?.name || "Client";
          
          const newTransactions: Transaction[] = [
            {
              id: "TX-OWN-" + Math.random().toString(36).substr(2, 9),
              type: "Rental Income",
              relatedId: res.id,
              userId: res.ownerId,
              counterparty: renterName,
              date: new Date().toISOString().split('T')[0],
              amount: ownerAmount,
              status: "Cleared"
            },
            {
              id: "TX-ADMIN-" + Math.random().toString(36).substr(2, 9),
              type: "Platform Fee",
              relatedId: res.id,
              userId: "u3", // Admin ID
              counterparty: equipmentName,
              date: new Date().toISOString().split('T')[0],
              amount: platformFee,
              status: "Cleared"
            }
          ];
          setTransactions(tPrev => [...newTransactions, ...tPrev]);
          
          // Update user balances (simulated)
          setUsers(uPrev => uPrev.map(u => {
            if (u.id === res.ownerId) return { ...u, walletBalance: (u.walletBalance || 0) + ownerAmount };
            // Optional: subtract from renter if we tracked their wallet properly
            return u;
          }));
        }
      }
      
      return updated;
    });
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
