export type Category = {
  id: number;
  name: string;
};

export type ProductImage = {
  id: number;
  imageUrl: string;
  isThumbnail: boolean;
};

export type ProductVariant = {
  id: number;
  sku: string;
  color: string;
  size: string;
  material: string | null;
  priceOverride: number;
  stockQuantity: number;
};

export type ProductDetail = {
  id: number;
  name: string;
  description: string;
  brandName: string;
  basePrice: number;
  isActive: boolean;
  createdAt: string;
  category: Category;
  productImages: ProductImage[];
  productVariants: ProductVariant[];
};
