"use client";

import { Card } from "@/components/ui/Card";
import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormElements";
import { Modal } from "@/components/ui/Modal";
import { useData } from "@/context/DataProvider";
import { useToast } from "@/components/ui/Toast";
import { ShieldOff, Mail, Search, UserPlus, Trash2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function AdminUsers() {
  const { users, createUser, deleteUser } = useData();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form state for creating a new owner
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const filteredUsers = (users || []).filter(u => 
    (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.id || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ownerCount = (users || []).filter(u => u.role === "Owner").length;
  const adminCount = (users || []).filter(u => u.role === "Admin").length;

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    setShowPassword(false);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      showToast("All fields are required.", "error");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    if (formData.password.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      return;
    }

    setLoading(true);
    try {
      await createUser(formData.name, formData.email, formData.password, "Owner");
      showToast(`Owner account created for ${formData.name}.`, "success");
      resetForm();
      setIsCreateModalOpen(false);
    } catch (err: any) {
      showToast(`Failed: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently remove "${name}" from the platform?`)) return;
    
    try {
      await deleteUser(id);
      showToast(`User "${name}" has been removed.`, "success");
    } catch (err: any) {
      showToast(`Deletion failed: ${err.message}`, "error");
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight">User <span className="text-primary">Control</span></h1>
          <p className="text-secondary text-sm">Manage platform accounts. Only admins can create owner accounts.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-surface-container border-none focus:ring-2 focus:ring-primary text-sm outline-none"
            />
          </div>
          <Button variant="primary" className="gap-2 shrink-0" onClick={() => setIsCreateModalOpen(true)}>
            <UserPlus size={18} /> New Owner
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="lowest" className="p-6 border border-surface-container flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <UserPlus size={20} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-secondary">Total Users</div>
            <div className="text-2xl font-black">{(users || []).length}</div>
          </div>
        </Card>
        <Card variant="lowest" className="p-6 border border-surface-container flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <UserPlus size={20} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-secondary">Owners</div>
            <div className="text-2xl font-black">{ownerCount}</div>
          </div>
        </Card>
        <Card variant="lowest" className="p-6 border border-surface-container flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
            <ShieldOff size={20} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-secondary">Admins</div>
            <div className="text-2xl font-black">{adminCount}</div>
          </div>
        </Card>
      </div>

      <Table headers={["User Profile", "System Role", "Wallet Balance", "Status", "Actions"]}>
        {filteredUsers.length > 0 ? filteredUsers.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {(user.name || "?").charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-sm tracking-tight">{user.name || "Unnamed"}</div>
                  <div className="text-[10px] text-secondary font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
                    <Mail size={10} /> {user.email}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 
                'bg-blue-100 text-blue-700'
              }`}>
                {user.role}
              </span>
            </TableCell>
            <TableCell>
              <div className="text-sm font-bold">
                {user.walletBalance ? `$${user.walletBalance.toLocaleString()}` : "—"}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-600">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" /> Active
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                {user.role !== 'Admin' && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="bg-red-50 text-red-600 hover:bg-red-100 p-2 border-red-100"
                    onClick={() => handleDeleteUser(user.id, user.name)}
                  >
                    <Trash2 size={18} />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        )) : (
          <TableRow>
            <TableCell className="text-center py-12 text-secondary italic">
              No users found matching your search.
            </TableCell>
            <TableCell>{""}</TableCell>
            <TableCell>{""}</TableCell>
            <TableCell>{""}</TableCell>
            <TableCell>{""}</TableCell>
          </TableRow>
        )}
      </Table>

      {/* Create Owner Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => { setIsCreateModalOpen(false); resetForm(); }}
        title="Create Owner Account"
        footer={(
          <>
            <Button variant="secondary" className="flex-1" onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>Cancel</Button>
            <Button className="flex-1 font-black" onClick={handleCreateUser} loading={loading}>Create Account</Button>
          </>
        )}
      >
        <form className="flex flex-col gap-5" onSubmit={handleCreateUser}>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-xs text-primary font-bold">
              This will create a new <strong>Equipment Owner</strong> account. The owner will receive login credentials to access their dashboard.
            </p>
          </div>
          <Input 
            label="Full Name" 
            placeholder="e.g. Ahmed Karim" 
            value={formData.name}
            onChange={(e: any) => setFormData({...formData, name: e.target.value})}
            required 
          />
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="owner@company.com" 
            value={formData.email}
            onChange={(e: any) => setFormData({...formData, email: e.target.value})}
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 block ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full h-12 px-4 pr-12 rounded-xl bg-surface-low border-none focus:ring-2 focus:ring-primary text-sm transition-all outline-none"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 block ml-1">Confirm</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full h-12 px-4 rounded-xl bg-surface-low border-none focus:ring-2 focus:ring-primary text-sm transition-all outline-none"
                required
              />
            </div>
          </div>
        </form>
      </Modal>

      <Card variant="low" className="p-8 border border-surface-container bg-surface-low/30 mt-auto">
        <h4 className="font-bold text-sm mb-4">Account Policy</h4>
        <p className="text-secondary text-xs leading-relaxed max-w-2xl">
          Only administrators can create new accounts on this platform. Owners cannot self-register. 
          Deletion actions are permanent — ensure all equipment and reservations are properly handled before removing an account.
        </p>
      </Card>
    </div>
  );
}
