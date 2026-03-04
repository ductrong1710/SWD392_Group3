"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Edit2, Trash2, Plus, Search, Menu } from "lucide-react";
import type { ProductSummary } from "../../types";
import { productsApi } from "../../services/product-api";
import { useToast } from "../../contexts/ToastContext";
import type { ProductCreateRequest } from "../../types";
import ProductFormModal from "./ProductFormModal";

interface AdminProductsProps {
  products: ProductSummary[];
  setProducts: (products: ProductSummary[]) => void;
}

interface ExtendedProductSummary extends ProductSummary {
  category?: { id: number; name: string };
}
export default function AdminProducts({
  products,
  setProducts,
}: AdminProductsProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddProduct = async (formData: ProductCreateRequest) => {
    try {
      setIsSubmitting(true);

      const response = await productsApi.create(formData);

      const images = response.productImages || [];
      const thumbnail =
        images.find((img: any) => img.isThumbnail)?.imageUrl ||
        images[0]?.imageUrl ||
        null;

      const newSummaryItem: ProductSummary = {
        id: response.id,
        name: response.name,
        brandName: response.brandName,
        price: response.basePrice,
        thumbnailUrl: thumbnail,
      };

      setProducts([newSummaryItem, ...products]);

      toast.success("Thành công", "AI đã phân loại và thêm sản phẩm!");
      setShowAddModal(false);
    } catch (error: any) {
      // Lấy chính xác error message từ Response của Axios/Fetch
      const backendError = error.response?.data?.message || error.message;
      console.error("Chi tiết lỗi:", error.response?.data);
      toast.error("Tạo thất bại", backendError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      // ✅ 3. Đổi sang gọi API lấy tất cả data (/v1/products/all)
      const data: any[] = await productsApi.getAllUnpaged(); 
      
      // ✅ 4. Map data chi tiết sang Summary và nhét thêm category vào
      const mappedProducts: ExtendedProductSummary[] = data.map((item) => ({
        id: item.id,
        name: item.name,
        brandName: item.brandName,
        price: item.basePrice,
        thumbnailUrl: item.productImages?.find((img: any) => img.isThumbnail)?.imageUrl || null,
        category: item.category, 
      }));

      setProducts(mappedProducts);
    } catch (error) {
      toast.error("Loading failed", "Could not load products");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 5. Bóc tách và lọc trùng Category từ list sản phẩm
  const uniqueCategories = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      if (p.category && !map.has(p.category.id)) {
        map.set(p.category.id, p.category);
      }
    });
    return Array.from(map.values());
  }, [products]);

  // ✅ 6. Lọc sản phẩm theo Search Name VÀ Category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategoryId === "" || p.category?.id === selectedCategoryId;
      return matchSearch && matchCategory;
    });
  }, [products, searchTerm, selectedCategoryId]);
  // const filteredProducts = useMemo(() => {
  //   return products.filter((p) =>
  //     p.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   )
  // }, [products, searchTerm])

  const handleDeleteProduct = useCallback(
    async (id: number) => {
      if (!window.confirm("Are you sure?")) return;

      try {
        await productsApi.delete(id);
        setProducts(products.filter((p) => p.id !== id));
        toast.success(
          "Product deleted",
          "Product has been removed successfully"
        );
      } catch (error) {
        toast.error("Delete failed", "Could not delete product");
      }
    },
    [products, setProducts, toast]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-semibold">
          Product Management
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* ✅ 2. Giao diện Search + Nút Menu 3 gạch (Custom Dropdown) */}
      <div className="flex items-center gap-3">
        {/* Thanh Search (Kéo dài hết cỡ) */}
        <div className="flex-1 flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>

        {/* Cụm Filter Category (Relative để nhốt cái menu absolute vào trong) */}
        <div className="relative">
          {/* Nút bấm 3 gạch */}
          <button
            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            className={`p-2 border border-border rounded-lg transition-colors flex items-center justify-center
              ${showCategoryMenu ? 'bg-secondary' : 'bg-background hover:bg-secondary'}
            `}
            title="Lọc theo danh mục"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>

          {/* Menu xổ xuống (Chỉ hiện khi showCategoryMenu = true) */}
          {showCategoryMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl z-50 py-2 overflow-hidden">
              <div className="px-3 py-2 border-b border-border text-xs font-semibold text-muted-foreground uppercase">
                CATEGORIES
              </div>
              
              {/* Nút "Tất cả" */}
              <button
                className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${
                  selectedCategoryId === "" ? "font-bold text-primary bg-primary/10" : ""
                }`}
                onClick={() => {
                  setSelectedCategoryId("");
                  setShowCategoryMenu(false); // Bấm xong tự đóng
                }}
              >
               All Categories
              </button>

              {/* Danh sách categories từ useMemo */}
              {uniqueCategories.map((cat: any) => (
                <button
                  key={cat.id}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${
                    selectedCategoryId === cat.id ? "font-bold text-primary bg-primary/10" : ""
                  }`}
                  onClick={() => {
                    setSelectedCategoryId(cat.id);
                    setShowCategoryMenu(false); // Bấm xong tự đóng
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Products Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Image</th>
                <th className="px-6 py-3 text-left font-semibold">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left font-semibold">Brand</th>
                <th className="px-6 py-3 text-left font-semibold">Price</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border hover:bg-secondary/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    {product.thumbnailUrl ? (
                      <img
                        src={product.thumbnailUrl}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-secondary rounded flex items-center justify-center text-xs text-muted-foreground">
                        No img
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {product.brandName}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-secondary rounded transition-colors">
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={isSubmitting}
                        className="p-2 hover:bg-secondary rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddProduct}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
