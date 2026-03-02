"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon, Star, Upload } from "lucide-react"
import { fetchProducts } from "../../services/product-api"
import type { ProductListItem } from "../../types/product"
import type { ProductDetail } from "../../types/product-detail"

export default function StaffProducts() {
  const [products, setProducts] = useState<ProductListItem[]>([
    {
      id: 1,
      name: "Classic Cotton T-Shirt",
      price: 29,
      brandName: "Nike",
      thumbnailUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"
    },
    {
      id: 2,
      name: "Denim Jacket Premium",
      price: 89,
      brandName: "Levi's",
      thumbnailUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400"
    },
    {
      id: 3,
      name: "Summer Floral Dress",
      price: 59,
      brandName: "Zara",
      thumbnailUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400"
    },
    {
      id: 4,
      name: "Leather Sneakers",
      price: 129,
      brandName: "Adidas",
      thumbnailUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"
    },
    {
      id: 5,
      name: "Wool Blend Coat",
      price: 189,
      brandName: "H&M",
      thumbnailUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400"
    },
    {
      id: 6,
      name: "Slim Fit Chinos",
      price: 49,
      brandName: "Uniqlo",
      thumbnailUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400"
    },
    {
      id: 7,
      name: "Silk Evening Gown",
      price: 249,
      brandName: "Gucci",
      thumbnailUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400"
    },
    {
      id: 8,
      name: "Canvas Backpack",
      price: 39,
      brandName: "Herschel",
      thumbnailUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"
    },
    {
      id: 9,
      name: "Running Shorts",
      price: 24,
      brandName: "Nike",
      thumbnailUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400"
    },
    {
      id: 10,
      name: "Knit Sweater",
      price: 69,
      brandName: "Gap",
      thumbnailUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400"
    }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductListItem | null>(null)
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    brandName: '',
    price: 0,
    thumbnailUrl: '',
    description: '',
    categoryId: 1,
    basePrice: 0,
    isActive: true
  })

  // Image upload states
  const [productImages, setProductImages] = useState<Array<{ url: string; isThumbnail: boolean; file?: File }>>([])
  const [thumbnailIndex, setThumbnailIndex] = useState(0)

  // useEffect(() => {
  //   loadProducts()
  // }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await fetchProducts({ page: 0, size: 50, sort: 'id', order: 'asc' })
      setProducts(response.content)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      brandName: '',
      price: 0,
      thumbnailUrl: '',
      description: '',
      categoryId: 1,
      basePrice: 0,
      isActive: true
    })
    setProductImages([])
    setThumbnailIndex(0)
    setShowModal(true)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newImages = Array.from(files).map((file, index) => ({
      url: URL.createObjectURL(file),
      isThumbnail: productImages.length === 0 && index === 0,
      file
    }))

    setProductImages(prev => [...prev, ...newImages])
  }

  const setThumbnail = (index: number) => {
    setProductImages(prev => prev.map((img, i) => ({
      ...img,
      isThumbnail: i === index
    })))
    setThumbnailIndex(index)
  }

  const removeImage = (index: number) => {
    setProductImages(prev => {
      const newImages = prev.filter((_, i) => i !== index)
      // If removed image was thumbnail, set first image as thumbnail
      if (prev[index].isThumbnail && newImages.length > 0) {
        newImages[0].isThumbnail = true
        setThumbnailIndex(0)
      }
      return newImages
    })
  }

  const handleEdit = (product: ProductListItem) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      brandName: product.brandName,
      price: product.price,
      thumbnailUrl: product.thumbnailUrl || '',
      description: '',
      categoryId: 1,
      basePrice: product.price,
      isActive: true
    })
    // Load existing image if available
    if (product.thumbnailUrl) {
      setProductImages([{ url: product.thumbnailUrl, isThumbnail: true }])
    } else {
      setProductImages([])
    }
    setThumbnailIndex(0)
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      // TODO: Call delete API
      alert('Delete functionality will be implemented with backend API')
      // await deleteProduct(id)
      // loadProducts()
    } catch (err) {
      alert('Failed to delete product')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingProduct) {
        // TODO: Call update API
        alert('Update functionality will be implemented with backend API')
        // await updateProduct(editingProduct.id, formData)
      } else {
        // TODO: Call create API
        alert('Create functionality will be implemented with backend API')
        // await createProduct(formData)
      }
      setShowModal(false)
      loadProducts()
    } catch (err) {
      alert('Failed to save product')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Product Management</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Loading & Error */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">Error: {error}</p>
        </div>
      )}

      {/* Products Table */}
      {!loading && !error && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Image</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Brand</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id} className={index % 2 === 0 ? 'bg-background' : 'bg-secondary/20'}>
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 bg-secondary rounded flex items-center justify-center overflow-hidden">
                      {product.thumbnailUrl ? (
                        <img src={product.thumbnailUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{product.brandName}</td>
                  <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 hover:bg-secondary rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  required
                />
              </div>

              {/* Brand Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Brand Name</label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium mb-2">Price (USD)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Product Images */}
              <div>
                <label className="block text-sm font-medium mb-2">Product Images</label>
                
                {/* File Upload */}
                <div className="mb-4">
                  <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg hover:bg-secondary transition-colors cursor-pointer">
                    <Upload className="w-5 h-5" />
                    <span>Upload Images (Multiple)</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">You can select multiple images. Click star to set thumbnail.</p>
                </div>

                {/* Image Preview Grid */}
                {productImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {productImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden border-2 border-border"
                        style={{ aspectRatio: '1/1' }}
                      >
                        <img
                          src={image.url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Overlay Controls */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setThumbnail(index)}
                            className={`p-2 rounded-full ${
                              image.isThumbnail
                                ? 'bg-yellow-500 text-white'
                                : 'bg-white/80 text-gray-700 hover:bg-yellow-400'
                            } transition-colors`}
                            title="Set as thumbnail"
                          >
                            <Star className="w-4 h-4" fill={image.isThumbnail ? 'currentColor' : 'none'} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                            title="Remove image"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Thumbnail Badge */}
                        {image.isThumbnail && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3" fill="currentColor" />
                            Thumbnail
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  rows={3}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
