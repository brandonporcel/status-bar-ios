export interface PaginationData<T> {
  currentPage: number;
  data: T[];
  perPage: number;
  total: number;
  lastPage: number;
}
