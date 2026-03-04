import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import type { ProductCreateRequest, ProductVariant } from "../../types";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductCreateRequest) => Promise<void>;
  isSubmitting: boolean;
}


export default function ProductFormModal({ isOpen, onClose, onSave, isSubmitting }: ProductFormModalProps) {
  const [formData, setFormData] = useState<ProductCreateRequest>({
    name: "",
    description: "",
    brandName: "",
    basePrice: 0,
    images: [], // Thêm mảng images
    variants: [{ sku: "", color: "", size: "", priceOverride: 0, stockQuantity: 0, material: "" }]
  });

  if (!isOpen) return null;

  const addImage = () => {
    setFormData({
      ...formData,
      images: [...(formData.images || []), { imageUrl: "", isThumbnail: formData.images?.length === 0, color: "" }]
    });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images?.filter((_, i) => i !== index) || [];
    // Đảm bảo luôn có 1 thumbnail nếu mảng còn phần tử
    if (newImages.length > 0 && !newImages.some(img => img.isThumbnail)) {
      newImages[0].isThumbnail = true; 
    }
    setFormData({ ...formData, images: newImages });
  };

  const updateImage = (index: number, field: string, value: any) => {
    let newImages = [...(formData.images || [])];
    
    // Nếu set cái này làm thumbnail, bỏ thumbnail của các ảnh khác
    if (field === 'isThumbnail' && value === true) {
        newImages = newImages.map(img => ({ ...img, isThumbnail: false }));
    }
    
    newImages[index] = { ...newImages[index], [field]: value };
    setFormData({ ...formData, images: newImages });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { sku: "", color: "", size: "", priceOverride: 0, stockQuantity: 0, material: "" }]
    });
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length <= 1) return;
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index)
    });
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ 2. Ép chuẩn Type, bỏ ép kiểu "any", bỏ categoryId
    const cleanData: ProductCreateRequest = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      brandName: formData.brandName.trim(),
      basePrice: Number(formData.basePrice) || 0,
      images: formData.images?.map(img => ({
          imageUrl: img.imageUrl.trim(),
          isThumbnail: img.isThumbnail,
          color: img.color?.trim() || "Default"
      })) || [],
      variants: formData.variants?.map((v, i) => ({
        sku: v.sku.trim() || `SKU-${Date.now()}-${i}`,
        color: v.color.trim() || "Default",
        size: v.size.trim() || "Free",
        material: v.material.trim() || "Standard",
        priceOverride: Number(v.priceOverride) || 0,
        stockQuantity: Number(v.stockQuantity) || 0,
      }))
    };

    onSave(cleanData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl flex flex-col">
        <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
          <div>
            <h3 className="text-xl font-bold">Add New Product</h3>
            <p className="text-sm text-muted-foreground mt-1">Fill all required fields to create a product.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Product Name *</label>
                <input required className="w-full p-2 border rounded" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Brand Name *</label>
                <input required className="w-full p-2 border rounded" value={formData.brandName} onChange={(e) => setFormData({...formData, brandName: e.target.value})} />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-semibold">Base Price ($) *</label>
                 <input required type="number" min="0" className="w-full p-2 border rounded" value={formData.basePrice} onChange={(e) => setFormData({...formData, basePrice: e.target.valueAsNumber})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Description (AI will classify based on this) *</label>
              <textarea required className="w-full p-2 border rounded h-[90%]" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>

          {/* ✅ 4. THÊM MỚI: UI nhập Hình ảnh */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-lg">Images</h4>
              <button type="button" onClick={addImage} className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded text-sm">
                <Plus className="w-4 h-4" /> Add Image
              </button>
            </div>
            {formData.images?.map((img, index) => (
                <div key={index} className="flex gap-4 items-center p-3 border rounded-lg">
                    <input required placeholder="Image URL..." className="flex-1 p-2 border rounded" value={img.imageUrl} onChange={(e) => updateImage(index, 'imageUrl', e.target.value)} />
                    <input placeholder="Color mapping" className="w-32 p-2 border rounded" value={img.color} onChange={(e) => updateImage(index, 'color', e.target.value)} />
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="thumbnail" checked={img.isThumbnail} onChange={() => updateImage(index, 'isThumbnail', true)} />
                        <span className="text-sm">Thumbnail</span>
                    </label>
                    <button type="button" onClick={() => removeImage(index)} className="p-2 text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
            ))}
          </div>

          {/* Biến thể (Variants) */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-lg">Variants</h4>
              <button type="button" onClick={addVariant} className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 text-sm">
                <Plus className="w-4 h-4" /> Add Variant
              </button>
            </div>
            
            <div className="border rounded-lg overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Color</th>
                    <th className="p-3">Size</th>
                    <th className="p-3">Material</th>
                    <th className="p-3">Price Over.</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {formData.variants.map((v, index) => (
                    <tr key={index} className="hover:bg-secondary/20">
                      <td className="p-2"><input placeholder="Auto" className="w-24 p-1 border rounded" value={v.sku} onChange={(e) => updateVariant(index, 'sku', e.target.value)} /></td>
                      <td className="p-2"><input placeholder="Color" required className="w-20 p-1 border rounded" value={v.color} onChange={(e) => updateVariant(index, 'color', e.target.value)} /></td>
                      <td className="p-2"><input placeholder="Size" required className="w-16 p-1 border rounded" value={v.size} onChange={(e) => updateVariant(index, 'size', e.target.value)} /></td>
                      <td className="p-2"><input placeholder="Material" required className="w-24 p-1 border rounded" value={v.material} onChange={(e) => updateVariant(index, 'material', e.target.value)} /></td>
                      <td className="p-2"><input type="number" min="0" required className="w-20 p-1 border rounded" value={v.priceOverride} onChange={(e) => updateVariant(index, 'priceOverride', e.target.valueAsNumber)} /></td>
                      <td className="p-2"><input type="number" min="0" required className="w-20 p-1 border rounded" value={v.stockQuantity} onChange={(e) => updateVariant(index, 'stockQuantity', e.target.valueAsNumber)} /></td>
                      <td className="p-2 text-center">
                        <button type="button" onClick={() => removeVariant(index)} className="text-destructive p-1 hover:bg-destructive/10 rounded"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-card">
            <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50">
              {isSubmitting ? "Processing..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}