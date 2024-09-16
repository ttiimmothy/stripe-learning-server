import {BadRequestException, Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {CreateProductInput} from "./dto/create-product.input";
import {ProductRepository} from "./product.repository";
import {Product, ProductDocument} from "./product.model";
import {ReviewRepository} from "../review/review.repository";
import {GetProductsInput} from "./dto/get-products.input";
import {FilterType} from "./filter.type";
import {generateProductResponse, generateProductsResponse} from "./product.utils";
import {ProductsType} from "./dto/get-products.response";
import {ReviewDocument} from "../review/review.model";
import {ProductType, ReviewsType} from "./dto/get-product.response";
import {generateReviewsResponse} from "../review/review.utils";
import {UserRepository} from "../user/user.repository";
import {User} from "../user/user.model";
import {UpdateProductInput} from "./dto/update-product.input";

@Injectable()
export class ProductService{
  constructor(private readonly productRepository: ProductRepository, private readonly reviewRepository: ReviewRepository, private readonly userRepository: UserRepository){}

  async createProduct(createProductInput: CreateProductInput): Promise<Product>{
    try {
      const savedProduct = await this.productRepository.create(createProductInput);
      const reviews = await this.reviewRepository.find({productId: savedProduct._id});
      let totalRating = 0;
      if(reviews.length > 0){
        totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        savedProduct.rating = averageRating;
        await this.productRepository.findByIdAndUpdate(savedProduct._id, savedProduct);
      }
      return savedProduct
    } catch (error) {
      throw new InternalServerErrorException("Error creating product");
    }
  }

  async getProducts(getProductsInput: GetProductsInput): Promise<{products: ProductDocument[], totalPages: number, totalProducts: number}>{
    try {
      const {category, color, minPrice, maxPrice, page = "1", limit = "10"} = getProductsInput;
      // console.log(getProductsInput);
      let filter: FilterType = {};
      if (category && category !== "all") {
        filter.category = category;
      }
      if (color && color !== "all") {
        filter.color = color;
      }
      if (minPrice && maxPrice) {
        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);
        if (!isNaN(min) && !isNaN(max)) {
          // $gte greater than or equal
          // $lte lower than or equal
          filter.price = {$gte: min, $lte: max}
        }
      }
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const totalProducts = await this.productRepository.countDocuments(filter);
      const totalPages = Math.ceil(totalProducts / parseInt(limit));
      // populate is used to get the author(id and email) of the product
      const products = await this.productRepository.find(filter,undefined, {skip, limit: parseInt(limit), sort: {createdAt: -1}, populate: {path: "author", select: "email role"}});
      return {products: products, totalPages, totalProducts};
    } catch (error) {
      throw new InternalServerErrorException("Error getting products");
    }
  }

  async getProductById(productId: string): Promise<{product: ProductDocument, reviews: ReviewDocument[]}>{
    try {
      const product = await this.productRepository.findById(productId, undefined, {populate: {path: "author", select: "email username role"}});
      if (!product) {
        throw new NotFoundException("Product not found");
      } 
      const reviews = await this.reviewRepository.find({productId}, {populate: {path: "userId", select: "email username role"}});
      return {product, reviews};
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }
      throw new InternalServerErrorException("Error getting product");
    }
  }

  // update product
  async updateProduct(productId: string, updateProductInput: UpdateProductInput): Promise<{message: string, product: Product}>{
    try {
      const updatedProduct = await this.productRepository.findByIdAndUpdate(productId, updateProductInput);
      if (!updatedProduct) {
        throw new NotFoundException("Product not found");
      }
      return {message: "Product updated successfully", product:updatedProduct};
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }
      throw new InternalServerErrorException("Error updating the product");
    }
  }

  async findById(id: string): Promise<Product> {
    try {
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw new NotFoundException("Product not found");
      }
      return product;
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }
      throw new InternalServerErrorException("Error getting product");
    }
  }

  async deleteProduct(productId: string): Promise<{message: string}>{
    try {
      const deletedProduct = await this.productRepository.findByIdAndDelete(productId);
      if (!deletedProduct) {
        throw new NotFoundException("Product not found");
      }
      await this.reviewRepository.deleteMany({productId});
      return {message: "Product deleted successfully"};
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }
      throw new InternalServerErrorException("Error deleting the product");
    }
  }

  async relatedProducts(productId: string): Promise<Product[]>{
    try {
      if(!productId){
        throw new BadRequestException("Product id is required");
      }
      const product = await this.productRepository.findById(productId);
      if (!product) {
        throw new NotFoundException("Product not found");
      }
      const titleRegex = new RegExp(product.name.split(' ').filter((word) => word.length > 1).join('|'), 'i');
      const relatedProducts = await this.productRepository.find({
        _id: {$ne: productId}, // exclude the current product
        $or: [
          {name: {$regex: titleRegex}}, // case insensitive, match any word in the name
          {category: product.category}, // match the category
        ],
      });
      return relatedProducts;
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }
      throw new InternalServerErrorException("Error getting related products");
    }
  }
}