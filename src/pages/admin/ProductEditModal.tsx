import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, data: any) => Promise<void>;
  productData: any | null; // Data gốc lấy từ API chi tiết
  isSubmitting: boolean;
  categories: any[]; // Danh sách category để user chọn lại nếu muốn
}

export default function ProductEditModal({ 
  isOpen, onClose, onSave, productData, isSubmitting, categories 
}: ProductEditModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brandName: "",
    basePrice: 0,
    categoryId: 0,
    isActive: true
  });

  // Đổ data cũ vào form khi mở Modal
  useEffect(() => {
    if (productData && isOpen) {
      setFormData({
        name: productData.name || "",
        description: productData.description || "",
        brandName: productData.brandName || "",
        basePrice: productData.basePrice || 0,
        categoryId: productData.category?.id || 0,
        isActive: productData.isActive !== undefined ? productData.isActive : true
      });
    }
  }, [productData, isOpen]);

  if (!isOpen || !productData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(productData.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card w-full max-w-2xl rounded-xl shadow-2xl flex flex-col">
        <div className="p-6 border-b border-border flex justify-between items-center bg-card rounded-t-xl">
          <h3 className="text-xl font-bold">Edit Product</h3>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Product Name</label>
            <input required className="w-full p-2 border rounded" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Brand Name</label>
              <input required className="w-full p-2 border rounded" value={formData.brandName} onChange={(e) => setFormData({...formData, brandName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Base Price ($)</label>
              <input required type="number" min="0" step="0.01" className="w-full p-2 border rounded" value={formData.basePrice} onChange={(e) => setFormData({...formData,basePrice: e.target.value === "" ? 0 : parseFloat(e.target.value)})} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Category</label>
            <select 
              className="w-full p-2 border rounded" 
              value={formData.categoryId} 
              onChange={(e) => setFormData({...formData, categoryId: Number(e.target.value)})}
            >
              <option value={0}>Select Category</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Description</label>
            <textarea required className="w-full p-2 border rounded h-32" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="flex items-center gap-2 mt-4">
             <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} />
             <label htmlFor="isActive" className="text-sm font-semibold cursor-pointer">Product is Active (Visible to customers)</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t mt-6">
            <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}