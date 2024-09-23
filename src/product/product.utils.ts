import { ProductsType } from './dto/get-products.response';

export const generateProductsResponse = (products: ProductsType[]) => {
  return products.map((product) => ({
    ...product,
    author: {
      _id: product.author._id,
      email: product.author.email,
      role: product.author.role,
    },
  }));
};
