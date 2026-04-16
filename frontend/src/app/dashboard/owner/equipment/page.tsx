"use client";

import { useState } from "react";
import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/FormElements";
import { useData } from "@/context/DataProvider";
import { useToast } from "@/components/ui/Toast";
import { Plus, Edit3, Trash2, Eye, Hammer, Construction } from "lucide-react";

export default function OwnerEquipment() {
  const { equipment, currentUser, addEquipment, updateEquipment, deleteEquipment } = useData();
  const { showToast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Earthmoving",
    pricePerDay: "",
    location: "",
    description: "",
    image: "https://images.pexels.com/photos/1078850/pexels-photo-1078850.jpeg?auto=compress&cs=tinysrgb&w=800"
  });

  // Filter equipment for the current owner
  const myEquipment = (equipment || []).filter(item => item.ownerId === currentUser?.id);

  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.pricePerDay || !formData.location || !formData.description) {
      showToast("Identification error: All technical fields are mandatory.", "error");
      return;
    }

    if (Number(formData.pricePerDay) <= 0) {
      showToast("Financial error: Rate must be a positive value.", "error");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      addEquipment({
        ...formData,
        pricePerDay: Number(formData.pricePerDay),
        ownerId: currentUser!.id,
        availability: true,
        status: "pending", 
        specs: {
          "Condition": "Certified",
          "Engine": "Standard",
          "Transmission": "Manual"
        }
      } as any);
      
      showToast("Technical draft submitted for review.", "success");
      setLoading(false);
      setIsAddModalOpen(false);
      setFormData({
        name: "",
        category: "Earthmoving",
        pricePerDay: "",
        location: "",
        description: "",
        image: "https://images.pexels.com/photos/1078850/pexels-photo-1078850.jpeg?auto=compress&cs=tinysrgb&w=800"
      });
    }, 1000);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this equipment from your fleet?")) {
      deleteEquipment(id);
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight">Manage <span className="text-primary">Fleet</span></h1>
          <p className="text-secondary text-sm">Control your industrial assets and availability status.</p>
        </div>
        <Button className="gap-2 shadow-lg hover:cosmic-shadow transition-all" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} /> List New Equipment
        </Button>
      </div>

      {myEquipment.length > 0 ? (
        <Table headers={["Asset", "Daily Rate", "Status", "Verification", "Actions"]}>
          {myEquipment.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden relative shrink-0">
                    <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold">{item.name}</div>
                    <div className="text-[10px] text-secondary uppercase tracking-widest">{item.category}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-bold">${item.pricePerDay}</div>
              </TableCell>
              <TableCell>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  item.availability ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {item.availability ? 'Active' : 'Rented'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-tighter ${
                    item.status === 'active' ? 'bg-blue-100 text-blue-600' : 
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {item.status}
                  </span>
                  {item.status === 'pending' && <span className="text-[9px] text-secondary">Awaiting Review</span>}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="tertiary" size="sm" className="p-2"><Edit3 size={18} /></Button>
                  <Button variant="tertiary" size="sm" className="p-2 text-red-500 hover:bg-red-50" onClick={() => handleDelete(item.id)}><Trash2 size={18} /></Button>
                  <Button variant="tertiary" size="sm" className="p-2"><Eye size={18} /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-surface-low rounded-[40px] border border-dashed border-surface-container">
          <Hammer size={48} className="text-secondary/20 mb-4" />
          <h4 className="font-bold text-lg mb-1">Your fleet is empty</h4>
          <p className="text-secondary text-xs mb-6">Start monetization by listing your first heavy machine.</p>
          <Button size="sm" onClick={() => setIsAddModalOpen(true)}>List New Equipment</Button>
        </div>
      )}

      {/* Add Equipment Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="List New Equipment"
        footer={(
          <>
            <Button variant="secondary" className="flex-1" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button className="flex-1 font-black" onClick={handleAddEquipment} loading={loading}>Submit for Review</Button>
          </>
        )}
      >
        <form className="flex flex-col gap-5">
          <Input 
            label="Equipment Name" 
            placeholder="e.g. Caterpillar 320D" 
            value={formData.name}
            onChange={(e: any) => setFormData({...formData, name: e.target.value})}
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Category" 
              options={[
                { value: "Earthmoving", label: "Earthmoving" },
                { value: "Lifting", label: "Lifting" },
                { value: "Concrete", label: "Concrete" },
                { value: "Materials", label: "Materials" },
                { value: "Tools", label: "Tools" }
              ]} 
              value={formData.category}
              onChange={(e: any) => setFormData({...formData, category: e.target.value})}
            />
            <Input 
              label="Daily Rate ($)" 
              type="number" 
              placeholder="450" 
              value={formData.pricePerDay}
              onChange={(e: any) => setFormData({...formData, pricePerDay: e.target.value})}
              required 
            />
          </div>
          <Input 
            label="Location" 
            placeholder="City, Country" 
            value={formData.location}
            onChange={(e: any) => setFormData({...formData, location: e.target.value})}
            required 
          />
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 block ml-1">Asset Description</label>
            <textarea 
              className="w-full h-32 px-4 py-3 rounded-xl bg-surface-low border-none focus:ring-2 focus:ring-primary text-sm transition-all outline-none resize-none"
              placeholder="Detail specs, usage history, and condition..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            ></textarea>
          </div>
        </form>
      </Modal>
    </div>
  );
}
