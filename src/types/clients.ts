export interface Clients{
    id: string;
    profileImage: string | null;
    name: string;
    phoneNumber: string;
    email: string;
    status: string;
    creationTime: string; 
    gender: string;
}
export interface ClientItemDetails {
    id: string;
    profileImage: string;
    name: string;
    phoneNumber: string;
    email: string;
    isActive: boolean;
    creationTime: string; // or Date, depending on how you handle it
    addressDescription: string | null;
    gender: string;
    status: string;
  }
  export interface TotalStatus{
    totalCount: number;
    totalBlocked:number;
    totalActive:number;
   }
