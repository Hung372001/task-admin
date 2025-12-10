export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TableHeader {
  text: string;
  value: string;
  align?: string;
  width?: string;
  sortable?: boolean;
}

export interface TableOptions {
  page: number;
  itemsPerPage: number;
  sortBy: string[];
  sortDesc: boolean[];
  groupBy: string[];
  groupDesc: boolean[];
  multiSort: boolean;
  mustSort: boolean;
}

export interface VuetifyTableHeader extends TableHeader {
  divider?: boolean;
  sort?: (a, b) => number;
}

export interface ApiResponse<T> {
  data: T[];
  pagination: Pagination;
  message?: string;
  status?: number;
}