import { AbstractRepository } from '../database/abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './product.model';
import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
@Injectable()
export class ProductRepository extends AbstractRepository<ProductDocument> {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {
    super(productModel);
  }

  async create(product: CreateProductInput): Promise<ProductDocument> {
    const newProduct = await this.productModel.create({
      ...product,
      _id: new Types.ObjectId(),
    });
    return newProduct.save();
  }

  // async countDocuments(filter: any): Promise<number> {
  //   return this.productModel.countDocuments(filter);
  // }
}
