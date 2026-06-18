export interface Offer {
  id: string;
  price: number;
  discount: number;
  startDate: Date;
  endDate: Date;
  minimumQuantity: number;
  maximumQuantity: number;
  stockQuantity: number;
  isActive: boolean;
  discountType: DiscountType;
  productUnitOfMeasure: ProductUnitOfMeasure;
}

interface ProductUnitOfMeasure {
  id: string;
  productNameAr: string;
  productNameEn: string;
  productBarcode: string;
  productImageUrl: string;
  unitOfMeasureNameAr: string;
  unitOfMeasureNameEn: string;
  price: number;
  stockQuantity: number;
}

export const enum DiscountType {
  PERCENTAGE = 'Percentage',
  FIXED = 'FixedAmount',
}
