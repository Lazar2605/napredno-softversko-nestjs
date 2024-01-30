import { SortOrder } from 'mongoose';

export type SortCriteria<T> = {
  [key in keyof T]?: SortOrder;
};

export type ProjectionFields<T> = {
  [key in keyof T]?: 1;
};

export interface PaginationOptions<T> {
  limit?: number;
  page?: number;
  sort?: SortCriteria<T>;
  populate?: string;
  populate2?: string;
  projection?: ProjectionFields<T>;
  kljucneReci?: string;
}