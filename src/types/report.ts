export interface ReportOrder {
  id: string;
  orderNumber: string;
  creationTime: string; // or Date if you'll convert the string to Date object
  paymentMethodName: string;
  totalOrderAmount: number;
  vatAmount: number;
  discount: number;
  shippingCost: number;
  totalPrice: number;
  isReturned: boolean;
}
export interface Report {
  totalSales: number;
  deliveryFees: number;
  valueAddedTax: number;
  discounts: number;
  netRevenue: number;
}