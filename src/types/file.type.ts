export interface TEBook {
  id: string;
  title: string;
  description: string;
  url: string;
  reviews: TReview[];
  imgUrl?: string;
}

export interface TReview {
  id: string;
  rating: number;
  description: string;
  title: string;
  reviewBy: string;
  mobile: string;
}
