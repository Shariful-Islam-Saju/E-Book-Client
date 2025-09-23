export interface TEBook {
  id: string;
  fileName: string;
  title: string;
  description: string;
  slug: string;
  url: string;
  reviews: TReview[];
  imgUrl?: string;
  discount: number;
  bookPrice: number
}

export interface TReview {
  id: string;
  rating: number;
  description: string;
  title: string;
  reviewBy: string;
  mobile: string;
}
