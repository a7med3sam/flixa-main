
import { Category } from './categories';


export interface PurchasedProduct {
  productId: string;
  productNameAr: string;
  productNameEn: string;
  productImage: string;
  unitOfMeasureId: string;
  unitOfMeasureNameAr: string;
  unitOfMeasureNameEn: string;
  productPrice: number;
  totalSoldCount: number;
}


export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  DescriptionAr: string;
  DescriptionEn: string;
  descriptionAr: string;
  descriptionEn: string;
  barcode: string;
  mainUnitId: string;
  unitOfMeasureNameAr: string;
  unitOfMeasureNameEn: string;
  unitOfMeasurePrice: number;
  stockQuantity: number;
  conversionRateInMainUnit: number;
  category: Category;
  isActive: boolean;
  productImages: ProductImage[];
  productUnitOfMeasures: [{ unitId: string; conversionRate: number; price: number }];
}

export interface UnitMeasure {
  id: string;
  nameAr: string;
  nameEn: string;
  name: string;
  isActive: boolean;
}

export interface ProductDetails {
  id: string;
  nameAr: string;
  nameEn: string;
  barcode: string;
  descriptionAr: string;
  descriptionEn: string;
  mainUnitId: string;
  category: Category;
  productUnitOfMeasures: ProductUnitOfMeasure[];
  productImages: ProductImage[];
  isActive: boolean;
  stockQuantity: number;
}

export interface ProductUnitOfMeasure {
  id: string;
  price: number;
  conversionRate: number;
  unitOfMeasureId: string;
  unitOfMeasureNameAr: string;
  unitOfMeasureNameEn: string;
}

export interface ProductImage {
  id: string;
  url: string;
}
