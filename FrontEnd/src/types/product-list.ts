export type ProductListItem = {
  id: number;
  name: string;
  price: number;
  brandName: string;
  thumbnailUrl: string | null;
};

export type Sort = {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
};

export type Pageable = {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  unpaged: boolean;
  paged: boolean;
};

export type ProductListResponse = {
  content: ProductListItem[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
};
