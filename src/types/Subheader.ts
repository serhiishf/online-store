import { SortDirection } from './Filter'

export interface SubHeaderData {
  sort: 'price' | 'title' | 'default',
  direction: SortDirection,
  searchData: string[],
  // viewType: string;
}
