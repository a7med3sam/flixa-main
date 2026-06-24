// Matches GET /api/v1/admin/pages response
export interface Page {
  id: string;
  slug: string;
  descriptionAr: string;
  descriptionEn: string;
}

// Matches PUT /api/v1/admin/pages/{id} request body
export interface UpdatePageRequest {
  descriptionAr: string;
  descriptionEn: string;
}
