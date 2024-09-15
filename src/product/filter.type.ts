export type FilterType = {
  category?: string;
  color?: string;
  price?: {
    $gte: number;
    $lte: number;
  }
}