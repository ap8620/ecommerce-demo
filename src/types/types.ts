
export type Product = {
  id: string | number;
  title: string;
  description: string;
  price: string | number;
  image: string;
  category: string;
  isSaved?: boolean;
};

export type ProductInCart = Product & {
  inCart: true;
  quantity: number | string;
};
type ProductNotInCart = Product & {
  inCart?: false;
};

export type ProductType = ProductInCart | ProductNotInCart;
