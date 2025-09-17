export interface TEBook {
  id: string;
  title: string;
  description: string;
  url: string;
  coverImage: string;
  reviews: TReview[];
}

export interface TReview {
  id: string;
  rating: number;
  description: string;
  title: string;
  reviewBy: string;
  mobile: string;
}
