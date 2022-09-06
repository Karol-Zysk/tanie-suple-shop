export type ProductsType = {
  products: {
    id: number;
    name: string;
    category: string;
    image: string;
    price: number;
    brand: string;
    rating: number;
    numReviews: number;
    flavours: string[];
    countInStock: number;
    description: string;
  }[];
};
