"use client";

import { useState, useRef } from "react";
import { useData } from "@/context/DataProvider";
import { Card } from "@/components/ui/Card";
import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { 
  Plus, 
  Trash2, 
  FileText, 
  Calendar,
  Image as ImageIcon,
  ArrowLeft,
  Upload,
  X,
  Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function BlogManagement() {
  const { articles, addArticle, deleteArticle } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    category: "CONSEILS",
    image: ""
  });

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setNewArticle(prev => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const handleReset = () => {
    setIsAdding(false);
    setImagePreview("");
    setImageMode("upload");
    setNewArticle({ title: "", content: "", category: "CONSEILS", image: "" });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addArticle(newArticle);
    handleReset();
  };

  return (
    <div className="flex flex-col gap-12 pb-20">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <Link href="/dashboard/admin" className="text-xs font-bold text-secondary hover:text-primary flex items-center gap-2 mb-2 transition-colors">
            <ArrowLeft size={14} /> Back to Operations
          </Link>
          <h1 className="text-4xl font-black tracking-tight">Blog <span className="text-primary">Management</span></h1>
          <p className="text-secondary text-sm">Create and curate platform editorial content.</p>
        </div>
        <Button 
          onClick={() => setIsAdding(true)}
          className="gap-2 bg-primary text-white shadow-xl shadow-primary/20"
        >
          <Plus size={20} /> Create New Article
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="lowest" className="p-8 border border-primary/20 bg-primary/5">
              <form onSubmit={handleAdd} className="flex flex-col gap-8">

                {/* Image Upload Section */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-widest text-secondary">Cover Image</label>
                    <div className="flex rounded-xl overflow-hidden border border-surface-container">
                      <button
                        type="button"
                        onClick={() => setImageMode("upload")}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-colors ${imageMode === "upload" ? "bg-primary text-white" : "bg-white text-secondary hover:bg-surface-low"}`}
                      >
                        <Upload size={13} /> Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode("url")}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-colors ${imageMode === "url" ? "bg-primary text-white" : "bg-white text-secondary hover:bg-surface-low"}`}
                      >
                        <LinkIcon size={13} /> Image URL
                      </button>
                    </div>
                  </div>

                  {imageMode === "upload" ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      className={`relative h-52 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
                        ${isDragging ? "border-primary bg-primary/10 scale-[1.01]" : "border-surface-container bg-white hover:border-primary/50 hover:bg-primary/5"}`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                      />
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <div className="flex flex-col items-center gap-2 text-white">
                              <Upload size={24} />
                              <span className="text-xs font-bold">Click to change image</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setImagePreview(""); setNewArticle(p => ({...p, image: ""})); }}
                            className="absolute top-3 right-3 bg-white/90 rounded-full p-1.5 hover:bg-white transition-colors shadow-lg"
                          >
                            <X size={14} className="text-gray-700" />
                          </button>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-secondary">
                          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <ImageIcon size={24} className="text-primary" />
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-sm text-foreground">Drag & drop your image here</p>
                            <p className="text-xs mt-1">or <span className="text-primary font-bold">click to browse</span> — JPG, PNG, WEBP</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <input
                        value={newArticle.image}
                        onChange={e => {
                          setNewArticle(prev => ({...prev, image: e.target.value}));
                          setImagePreview(e.target.value);
                        }}
                        placeholder="https://images.pexels.com/photos/..."
                        className="w-full h-12 px-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-primary text-sm font-bold"
                      />
                      {imagePreview && (
                        <div className="h-40 rounded-2xl overflow-hidden bg-surface-low">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" onError={() => setImagePreview("")} />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-black uppercase tracking-widest text-secondary">Article Title</label>
                      <input 
                        required
                        value={newArticle.title}
                        onChange={e => setNewArticle({...newArticle, title: e.target.value})}
                        placeholder="e.g. How to maintain your excavator"
                        className="w-full h-12 px-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-primary text-sm font-bold"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-black uppercase tracking-widest text-secondary">Category</label>
                      <select 
                        value={newArticle.category}
                        onChange={e => setNewArticle({...newArticle, category: e.target.value})}
                        className="w-full h-12 px-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-primary text-sm font-bold"
                      >
                        <option>CONSEILS</option>
                        <option>SÉCURITÉ</option>
                        <option>GUIDE</option>
                        <option>ACTUALITÉS</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-secondary">Content / Summary</label>
                    <textarea 
                      required
                      value={newArticle.content}
                      onChange={e => setNewArticle({...newArticle, content: e.target.value})}
                      placeholder="Describe your article content here..."
                      className="w-full h-full min-h-[140px] p-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-primary text-sm font-medium resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="tertiary" onClick={handleReset}>Cancel</Button>
                  <Button type="submit" className="bg-primary text-white px-12">Publish Article</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-6">
        <h3 className="text-2xl font-bold flex items-center gap-3">
          <FileText className="text-primary" /> Published Articles
        </h3>
        
        <Table headers={["Article", "Category", "Published Date", "Actions"]}>
          {articles.length > 0 ? articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell>
                <div className="flex items-center gap-4 py-2">
                  <div className="w-16 h-12 rounded-lg bg-surface-container overflow-hidden relative shadow-sm shrink-0">
                    {article.image ? (
                      <img src={article.image} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-primary/20">
                        <ImageIcon size={18} />
                      </div>
                    )}
                  </div>
                  <div className="font-bold text-sm tracking-tight max-w-sm truncate">{article.title}</div>
                </div>
              </TableCell>
              <TableCell>
                <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase">
                  {article.category}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-secondary text-xs font-medium">
                  <Calendar size={14} />
                  {new Date(article.createdAt).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell>
                <Button 
                  variant="tertiary" 
                  size="sm" 
                  className="p-2 text-red-500 hover:bg-red-50"
                  onClick={() => deleteArticle(article.id)}
                >
                  <Trash2 size={18} />
                </Button>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-20 text-secondary italic">
                No articles published yet. Click the button above to create one.
              </TableCell>
            </TableRow>
          )}
        </Table>
      </div>
    </div>
  );
}
