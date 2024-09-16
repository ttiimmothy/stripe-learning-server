import { ProductType } from './dto/get-product.response';
import { ProductsType } from './dto/get-products.response';
// import { ProductDocument } from './product.model';

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

export const generateProductResponse = (product: ProductType) => {
  return {
    ...product,
    author: {
      _id: product.author._id,
      email: product.author.email,
      username: product.author.username,
      role: product.author.role,
    },
  };
};
