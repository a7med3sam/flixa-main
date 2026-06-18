export interface Coupon {
    id: string;
    code: string;
    discount: number;
    startDate: string; // ISO date string
    endDate: string; // ISO date string
    numberOfUsagesNow: number;
    maximumNumberOfUsages: number;
    isActive: boolean;
    type:string;
  }