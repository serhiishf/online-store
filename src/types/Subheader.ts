import { SortDirection, SortType } from './Filter';

export interface SubHeaderData {
  sort: 'default' | SortType;
  direction: SortDirection;
  searchData: string[];
  // viewType: string;
}
