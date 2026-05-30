/**
 * AANDILIK Reservation Tracking Utility
 * Generates and manages tracking codes stored in localStorage
 */

export interface TrackedReservation {
  trackingCode: string;
  reservationId: string;
  equipmentName: string;
  equipmentImage: string;
  clientNom: string;
  clientEmail: string;
  clientTelephone: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "Pending" | "Confirmed" | "In Progress" | "Completed" | "Cancelled";
  createdAt: string;
  history: { label: string; time: string; done: boolean }[];
}

const STORAGE_KEY = "aandilik_tracked_reservations";

export function generateTrackingCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "ADL-";
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += "-";
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function saveTrackedReservation(data: TrackedReservation): void {
  const all = getAllTrackedReservations();
  all[data.trackingCode] = data;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getAllTrackedReservations(): Record<string, TrackedReservation> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function findReservationByCode(code: string): TrackedReservation | null {
  const all = getAllTrackedReservations();
  return all[code.toUpperCase().trim()] || null;
}

export function updateTrackedStatus(
  trackingCode: string,
  status: TrackedReservation["status"]
): void {
  const all = getAllTrackedReservations();
  if (!all[trackingCode]) return;
  all[trackingCode].status = status;

  // Update history timeline
  const historyMap: Record<string, string> = {
    Pending: "Demande reçue",
    Confirmed: "Confirmé par l'équipe",
    "In Progress": "Matériel en transit",
    Completed: "Session terminée",
    Cancelled: "Réservation annulée",
  };
  const now = new Date().toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const idx = all[trackingCode].history.findIndex(
    (h) => h.label === historyMap[status]
  );
  if (idx !== -1) {
    all[trackingCode].history[idx].done = true;
    all[trackingCode].history[idx].time = now;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function buildInitialHistory(
  status: TrackedReservation["status"],
  createdAt: string
): TrackedReservation["history"] {
  const steps = [
    { label: "Demande reçue", key: "Pending" },
    { label: "Confirmé par l'équipe", key: "Confirmed" },
    { label: "Matériel en transit", key: "In Progress" },
    { label: "Session terminée", key: "Completed" },
  ];
  const order = ["Pending", "Confirmed", "In Progress", "Completed"];
  const currentIdx = order.indexOf(status);

  return steps.map((step, i) => ({
    label: step.label,
    time:
      i === 0
        ? new Date(createdAt).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })
        : i < currentIdx
        ? "Complété"
        : i === currentIdx
        ? "En cours"
        : "En attente",
    done: i <= currentIdx,
  }));
}
