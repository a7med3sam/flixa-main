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
export interface Reports{
  totalClients: number;
  totalDrivers: number;
  totalOrders: number;
  totalOrdersFreeShoppingCost: number;
}
export interface SalesRevenue {
  totalSales: number;
  totalRevenue: number;
  homeDaySales: {
    dayOfWeek: number;
    dayDate: string; // ISO date string
    totalSales: number;
    totalRevenue: number;
  }[];
}

export interface FreeShipping{
  id: string;
  nameAr: string;
  nameEn: string;
  value: number;
}
export interface SettingItem {
  id: string;
  nameAr: string;
  nameEn: string;
  value: string;
}

export interface SettingData {
  totalCount: number;
  items: SettingItem[];
}

export interface SettingApiData {
  code: number;
  message: string;
  data: SettingData;
}

export interface SettingApiResponse {
  success: boolean;
  data: SettingApiData;
  message: string;
  status: number;
}