"use client";

import { useState } from "react";
import { useData } from "@/context/DataProvider";
import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import {
  Truck,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Wrench,
  Eye,
  User,
  Tag,
  BarChart3,
} from "lucide-react";

export default function FleetOversightPage() {
  const { equipment, users, updateEquipment } = useData();
  const { showToast } = useToast();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleApprove = async (id: string, name: string) => {
    setLoadingId(id);
    try {
      await updateEquipment(id, { status: "active" } as any);
      showToast(`✅ "${name}" is now active and visible to clients.`, "success");
    } catch (err: any) {
      showToast(`Failed to approve: ${err.message}`, "error");
    } finally {
      setLoadingId(null);
    }
  };

  const handleSuspend = async (id: string, name: string) => {
    setLoadingId(id);
    try {
      await updateEquipment(id, { status: "inactive" } as any);
      showToast(`⛔ "${name}" has been suspended and hidden from the marketplace.`, "error");
    } catch (err: any) {
      showToast(`Failed to suspend: ${err.message}`, "error");
    } finally {
      setLoadingId(null);
    }
  };

  const handleView = (id: string) => {
    router.push(`/equipment/${id}`);
  };

  // All equipment with owner info
  const allEquipment = equipment.map((item) => {
    const owner = users.find((u) => u.id === item.ownerId);
    return { ...item, owner };
  });

  const filtered = allEquipment.filter((item) => {
    const matchesSearch =
      !search ||
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.owner?.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.owner?.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: allEquipment.length,
    active: allEquipment.filter((e) => e.status === "active").length,
    pending: allEquipment.filter((e) => e.status === "pending").length,
    maintenance: allEquipment.filter((e) => e.status === "maintenance").length,
  };

  const statusConfig: Record<
    string,
    { label: string; color: string; bg: string }
  > = {
    active: { label: "Active", color: "text-green-700", bg: "bg-green-50 border-green-200" },
    pending: { label: "En attente", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
    maintenance: { label: "Maintenance", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
    inactive: { label: "Inactif", color: "text-slate-500", bg: "bg-slate-50 border-slate-200" },
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight">
          Fleet <span className="text-primary">Oversight</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Monitor all equipment listed by owners across the platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Listings", value: stats.total, icon: Truck, color: "text-slate-700", bg: "bg-slate-100" },
          { label: "Active", value: stats.active, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
          { label: "Awaiting Review", value: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Maintenance", value: stats.maintenance, icon: Wrench, color: "text-blue-600", bg: "bg-blue-50" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center gap-4 shadow-sm"
          >
            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
              <stat.icon size={22} className={stat.color} />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search equipment or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-white border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>

        {/* Status filter pills */}
        {["all", "active", "pending", "maintenance", "inactive"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              filterStatus === s
                ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
            }`}
          >
            {s === "all" ? "All" : statusConfig[s]?.label || s}
          </button>
        ))}

        <div className="ml-auto text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <BarChart3 size={14} /> {filtered.length} Result{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Table */}
      <Table headers={["Equipment", "Owner", "Category", "Price / Day", "Status", "Actions"]}>
        {filtered.length > 0 ? (
          filtered.map((item) => {
            const sc = statusConfig[item.status] || statusConfig.inactive;
            return (
              <TableRow key={item.id}>
                {/* Equipment */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Truck size={20} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">ID #{item.id}</div>
                    </div>
                  </div>
                </TableCell>

                {/* Owner */}
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <User size={11} className="text-primary" />
                      {item.owner?.name || "Unknown Owner"}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                      {item.owner?.email || "No email"}
                    </div>
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg w-fit">
                    <Tag size={10} />
                    {item.category || "N/A"}
                  </div>
                </TableCell>

                {/* Price */}
                <TableCell>
                  <div className="text-sm font-black text-primary">
                    {item.pricePerDay?.toLocaleString() || "—"}{" "}
                    <span className="text-slate-400 font-medium text-[10px]">MAD</span>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${sc.bg} ${sc.color}`}>
                    {item.status === "active" && <CheckCircle size={10} />}
                    {item.status === "pending" && <Clock size={10} />}
                    {item.status === "maintenance" && <Wrench size={10} />}
                    {item.status === "inactive" && <XCircle size={10} />}
                    {sc.label}
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className="flex gap-1.5">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 px-3 text-[10px] font-bold gap-1"
                      onClick={() => handleView(item.id)}
                    >
                      <Eye size={11} /> View
                    </Button>
                    {item.status === "pending" && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="h-8 px-3 text-[10px] font-bold bg-green-500 hover:bg-green-600 border-none gap-1"
                        loading={loadingId === item.id}
                        onClick={() => handleApprove(item.id, item.name)}
                      >
                        <CheckCircle size={11} /> Approve
                      </Button>
                    )}
                    {(item.status === "active" || item.status === "maintenance") && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 px-3 text-[10px] font-bold text-red-600 border-red-100 bg-red-50 hover:bg-red-100 gap-1"
                        loading={loadingId === item.id}
                        onClick={() => handleSuspend(item.id, item.name)}
                      >
                        <XCircle size={11} /> Suspend
                      </Button>
                    )}
                    {item.status === "inactive" && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="h-8 px-3 text-[10px] font-bold bg-green-500 hover:bg-green-600 border-none gap-1"
                        loading={loadingId === item.id}
                        onClick={() => handleApprove(item.id, item.name)}
                      >
                        <CheckCircle size={11} /> Re-activate
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="h-48 text-center text-slate-400 text-sm font-bold">
              <div className="flex flex-col items-center gap-3">
                <Truck size={40} className="text-slate-200" />
                No equipment found matching your criteria.
              </div>
            </TableCell>
          </TableRow>
        )}
      </Table>
    </div>
  );
}
