// Type pour les filtres
export interface Filters {
  search: string;
  status: "Lead" | "Prospect" | "Client" | null;
  tags: string[];
  sortBy: string | null;
  sortOrder: "asc" | "desc" | null;
}

