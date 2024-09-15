import {Product} from "./product.model";
import {ProductService} from "./product.service";
import {CreateProductInput} from "./dto/create-product.input";
import {Mutation, Args, Resolver, Query} from "@nestjs/graphql";
import {ObjectIdPipe} from "./product.pipe";
import {Types} from "mongoose";
import {GetProductByIdInput, GetProductsInput} from "./dto/get-products.input";
import {GetProductsResponse} from "./dto/get-products.response";
import {GetProductResponse} from "./dto/get-product.response";
import User from "../user/user.model.extra";
import {UpdateProductInput} from "./dto/update-product.input";
import {UpdateProductResponse} from "./dto/update-product.response";
import {UseGuards} from "@nestjs/common";
import {AuthGuard} from "../auth/auth.guard";
import {DeleteProductResponse} from "./dto/delete-product.response";
import {AuthAdminGuard} from "../auth/authAdmin.guard";

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService){}

  @Mutation(() => Product)
  async createProduct(@Args("createProductInput") createProductInput: CreateProductInput){
    try {
      return this.productService.createProduct(createProductInput);
    } catch (error) {
      throw error;
    }
  }

  @Query(() => GetProductsResponse)
  async getProducts(@Args("getProductsInput") getProductsInput: GetProductsInput){
    try {
      return this.productService.getProducts(getProductsInput);
    } catch (error) {
      throw error;
    }
  }

  @Query(() => GetProductResponse)
  async getProductById(@Args("productId") productId: string){
    try {
      return this.productService.getProductById(productId);
    } catch (error) {
      throw error;
    }
  }

  @Query(() => Product)
  async product(@Args("id") id: string) {
    try {
      return this.productService.findById(id);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard, AuthAdminGuard)
  @Mutation(() => UpdateProductResponse)
  async updateProduct(@Args("productId") productId: string, @Args("updateProductInput") updateProductInput: UpdateProductInput){
    try {
      return this.productService.updateProduct(productId, updateProductInput);
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => DeleteProductResponse)
  async deleteProduct(@Args("productId") productId: string){
    try {
      return this.productService.deleteProduct(productId);
    } catch (error) {
      throw error;
    }
  }

  @Query(() => [Product])
  async relatedProducts(@Args("productId") productId: string){
    try {
      return this.productService.relatedProducts(productId);
    } catch (error) {
      throw error;
    }
  }
}