export type ProductsType = {
  product: {
    id: number;
    name: string;
    slug: string;
    category: string;
    image: string;
    price: number;
    brand: string;
    rating: number;
    numReviews: number;
    flavours: string[];
    countInStock: number;
    description: string;
  };
};
