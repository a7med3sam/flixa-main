export interface Order {
    id: string;
    orderNumber: string;
    clientName: string;
    creationTime: string;
    paymentMethodName: string;
    totalOrderAmount: number;
    driverName: string;
    status: string;
    isPaid: boolean;
    transactionStatus:string;
    orderStatus: string;
  }
  export interface OrderListResponse  {
    totalCount: number;
    items: Order[];
  }
 // Define a generic response interface
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  status: number;
}

// Define OrderStatus interface
export interface OrderStatus {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  canceled: number;
  returned: number;
  inProgress: number;
  accepted: number;
  rejected: number;
  partiallyReturned:number;
}

  export interface PaymentMethod {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    processingFee: number;
    image: string;
  }

  export interface PaymentMethodsData {
    totalCount: number;
    items: PaymentMethod[];
  }

  export interface PaymentMethodsApiResponse {
    success: boolean;
    data: {
      items: PaymentMethod[];
      code: number;
      message: string;
      data: PaymentMethodsData[];
      name: string;
    };
    message: string;
    status: number;
  }
  export interface OrderItem {
    id: string;
    productId: string;
    productBarcode: string;
    productNameAr: string;
    productNameEn: string;
    productImage: string;
    unitOfMeasureNameAr: string;
    unitOfMeasureNameEn: string;
    quantity: number;
    priceAtPurchase: number;
    totalPriceWithVat: number;
    totalPrice: number;
    priceAtPurchaseWithVat: number;

  }
export interface OrderDetailsType {
  id: string;
  orderNumber: string;
  status: string;
  creationTime: string;
  lastModificationTime: string;

  client: {
    name: string;
    phone: string;
    email: string;
  };

  address: {
    description: string;
    longitude: number;
    latitude: number;
  };

  driver: {
    id: string;
    name: string;
    phoneNumber: string;
  } | null;

  payment: {
    paymentMethodName: string;
    transactionStatus: string;
    isPaid: boolean;
  };

  pricing: {
    totalPrice: number;
    discount: number;
    shippingCost: number;
    vatRate: number;
    vatAmount: number;
    paymentFee: number;
    totalOrderAmount: number;
  };

  note: string | null;

  orderItems: OrderItem[];
}

// Define OrderItem interface based on the provided data
export interface OrderItem {
  id: string;
  productId: string;
  productBarcode: string;
  productNameAr: string;
  productNameEn: string;
  productImage: string;
  unitOfMeasureNameAr: string;
  unitOfMeasureNameEn: string;
  quantity: number;
  priceAtPurchase: number;
  priceAtPurchaseWithVat: number;
  totalPrice: number;
  totalPriceWithVat: number;
}

  export interface OrderResponse {
    success: boolean;
    data: OrderDetailsType;
    message: string;
    status: number;
  }
  export interface DriverOrder {

    orderId: string;
  orderNumber: string;
  orderCreatedDate: string; // ISO date string
  orderStatus: string;
  clientName: string;
  totalOrderAmount: number;
  paymentMethodName: string;
  }
  export interface DriverOrders{
    items:DriverOrder[]

  }