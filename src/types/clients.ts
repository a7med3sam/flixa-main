// Matches GET /api/v1/admin/customers response
export interface Clients {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  profileImage: string | null;
}

// Matches GET /api/v1/admin/customers/{id}
export interface ClientItemDetails {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  profileImage: string | null;
  nationalId?: string;
}

// Matches POST /api/v1/admin/customers request body
export interface CreateClientPayload {
  name: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
}

export interface TotalStatus {
  totalCount: number;
  totalBlocked: number;
  totalActive: number;
}

// API list response wrapper
export interface CustomersListResponse {
  items: Clients[];
  totalCount: number;
}
