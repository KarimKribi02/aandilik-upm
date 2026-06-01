"use client";

import { Card } from "@/components/ui/Card";
import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input, FileUploader } from "@/components/ui/FormElements";
import { Modal } from "@/components/ui/Modal";
import { useData } from "@/context/DataProvider";
import { useToast } from "@/components/ui/Toast";
import { Plus, Edit3, Trash2, Search, Grid } from "lucide-react";
import { useState } from "react";

export default function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useData();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: ""
  });

  const filteredCategories = (categories || []).filter(cat => 
    (cat.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cat.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({ name: "", image: "", description: "" });
    setSelectedCategory(null);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      showToast("Category name is required.", "error");
      return;
    }

    setLoading(true);
    try {
      await addCategory(formData);
      showToast("Category added successfully.", "success");
      setIsAddModalOpen(false);
      resetForm();
    } catch (err: any) {
      showToast(`Failed: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    if (!formData.name) {
      showToast("Category name is required.", "error");
      return;
    }

    setLoading(true);
    try {
      await updateCategory(selectedCategory.id, formData);
      showToast("Category updated successfully.", "success");
      setIsEditModalOpen(false);
      resetForm();
    } catch (err: any) {
      showToast(`Failed: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"?`)) return;
    
    try {
      await deleteCategory(id);
      showToast("Category deleted.", "success");
    } catch (err: any) {
      showToast(`Failed: ${err.message}`, "error");
    }
  };

  const openEditModal = (cat: any) => {
    setSelectedCategory(cat);
    setFormData({
      name: cat.name,
      image: cat.image || "",
      description: cat.description || ""
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight">System <span className="text-primary">Categories</span></h1>
          <p className="text-secondary text-sm">Manage equipment categories that owners see when listing assets.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-surface-container border-none focus:ring-2 focus:ring-primary text-sm outline-none"
            />
          </div>
          <Button variant="primary" className="gap-2 shrink-0" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} /> New Category
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="lowest" className="p-6 border border-surface-container flex items-center gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl text-zinc-600">
            <Grid size={20} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-secondary">Total Categories</div>
            <div className="text-2xl font-black">{(categories || []).length}</div>
          </div>
        </Card>
      </div>

      <Table headers={["Category", "Description", "Items Count", "Actions"]}>
        {filteredCategories.length > 0 ? filteredCategories.map((cat) => (
          <TableRow key={cat.id}>
            <TableCell>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden relative shrink-0 bg-slate-100">
                  <img 
                    src={cat.image || "https://images.pexels.com/photos/1078850/pexels-photo-1078850.jpeg?auto=compress&cs=tinysrgb&w=800"} 
                    alt={cat.name} 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                </div>
                <div className="font-bold text-sm tracking-tight">{cat.name}</div>
              </div>
            </TableCell>
            <TableCell>
              <p className="text-[11px] text-secondary line-clamp-1 max-w-[300px]">
                {cat.description || "No description provided."}
              </p>
            </TableCell>
            <TableCell>
              <span className="text-sm font-bold text-zinc-900">
                {/* Normally we'd filter equipment here, but we can keep it simple */}
                Live
              </span>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="tertiary" size="sm" className="p-2" onClick={() => openEditModal(cat)}>
                  <Edit3 size={18} />
                </Button>
                <Button 
                  variant="tertiary" 
                  size="sm" 
                  className="p-2 text-red-500 hover:bg-red-50" 
                  onClick={() => handleDeleteCategory(cat.id, cat.name)}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )) : (
          <TableRow>
            <TableCell className="text-center py-12 text-secondary italic">
              No categories found.
            </TableCell>
            <TableCell>{""}</TableCell>
            <TableCell>{""}</TableCell>
            <TableCell>{""}</TableCell>
          </TableRow>
        )}
      </Table>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); resetForm(); }}
        title="Create New Category"
        footer={(
          <>
            <Button variant="secondary" className="flex-1" onClick={() => { setIsAddModalOpen(false); resetForm(); }}>Cancel</Button>
            <Button className="flex-1 font-black" onClick={handleAddCategory} loading={loading}>Create Category</Button>
          </>
        )}
      >
        <form className="flex flex-col gap-5" onSubmit={handleAddCategory}>
          <Input 
            label="Category Name" 
            placeholder="e.g. Excavators" 
            value={formData.name}
            onChange={(e: any) => setFormData({...formData, name: e.target.value})}
            required 
          />
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 block ml-1">Description</label>
            <textarea 
              className="w-full h-24 px-4 py-3 rounded-xl bg-surface-low border-none focus:ring-2 focus:ring-primary text-sm transition-all outline-none resize-none"
              placeholder="Brief description of this category..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>
          <FileUploader 
            label="Category Cover Image" 
            value={formData.image} 
            onChange={(base64) => setFormData({...formData, image: base64})} 
          />
        </form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); resetForm(); }}
        title="Edit Category"
        footer={(
          <>
            <Button variant="secondary" className="flex-1" onClick={() => { setIsEditModalOpen(false); resetForm(); }}>Cancel</Button>
            <Button className="flex-1 font-black" onClick={handleUpdateCategory} loading={loading}>Save Changes</Button>
          </>
        )}
      >
        <form className="flex flex-col gap-5" onSubmit={handleUpdateCategory}>
          <Input 
            label="Category Name" 
            value={formData.name}
            onChange={(e: any) => setFormData({...formData, name: e.target.value})}
            required 
          />
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 block ml-1">Description</label>
            <textarea 
              className="w-full h-24 px-4 py-3 rounded-xl bg-surface-low border-none focus:ring-2 focus:ring-primary text-sm transition-all outline-none resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>
          <FileUploader 
            label="Update Cover Image" 
            value={formData.image} 
            onChange={(base64) => setFormData({...formData, image: base64})} 
          />
        </form>
      </Modal>
    </div>
  );
}
