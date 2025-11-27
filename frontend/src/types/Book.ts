export interface Book {
  _id: string;
  title: string;
  author: string;
  status: string;
  rating: number;
  createdAt?: Date;
}
