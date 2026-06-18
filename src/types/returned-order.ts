export interface ReturnedOrder {
  id: string;
  orderId: string;
  orderNumber: string;
  orderNote: null;
  returnOrderNumber: string;
  clientName: string;
  paymentMethodName: string;
  driverName: string;
  totalReturnedItemsPrice: number;
  vatRate: number;
  vatAmount: number;
  refundAmount: number;
  returnedDate: Date;
  reason: string;
  adminReason: null;
  status: string;
}
export interface ReturnOrderDetails {
  orderDate: Date;
  phone: string;
  email: string;
  orderItemsCount: number;
  address: Address;
  orderItems: OrderItem[];
  id: string;
  orderId: string;
  orderNumber: string;
  orderNote: string;
  returnOrderNumber: string;
  clientName: string;
  paymentMethodName: string;
  driverName: string;
  totalReturnedItemsPrice: number;
  vatRate: number;
  vatAmount: number;
  refundAmount: number;
  returnedDate: Date;
  reason: string;
  adminReason: null;
  status: string;
}

export interface Address {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  isDefault: boolean;
  userId: string;
}

export interface OrderItem {
  id: string;
  productBarcode: string;
  name: MeasurementUnit;
  productImages: ProductImage[];
  measurementUnit: MeasurementUnit;
  quantity: number;
  priceAtPurchase:number;
  totalPrice:number;
  priceAtPurchaseWithVat: number;
  totalPriceWithVat: number;

}

export interface MeasurementUnit {
  nameEn: string;
  nameAr: string;
}

export interface ProductImage {
  imageUrl: string;
}

export interface ReturnedOrderItem {
  id: string;
  name: {
    nameEn: string;
    nameAr: string;
  };
  productImages: {
    imageUrl: string;
  }[];
  measurementUnit: {
    nameEn: string;
    nameAr: string;
  };
  price: number;
  quantity: number;
  totalPrice: number;
  productBarcode: string;
}

