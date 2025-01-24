export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
}

export type SortDirection = 'asc' | 'desc';