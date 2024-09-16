import { AbstractRepository } from "../database/abstract.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Review, ReviewDocument } from "./review.model";
import { FilterQuery, Model, Types, QueryOptions, PopulateOptions } from "mongoose";
import { Injectable } from "@nestjs/common";
@Injectable()
export class ReviewRepository extends AbstractRepository<ReviewDocument> {
  constructor(@InjectModel(Review.name) reviewModel: Model<ReviewDocument>) {
    super(reviewModel);
  }

  async findOne(filterQuery: FilterQuery<ReviewDocument>): Promise<ReviewDocument> {
    const document = await this.model.findOne(filterQuery).lean<ReviewDocument>();
    return document;
  }

  async findById(id: string, projection?: string | Record<string, any>, options?: QueryOptions & {populate?: PopulateOptions | PopulateOptions[]}): Promise<ReviewDocument> {
    const document = await this.model.findById(id).select(projection).lean<ReviewDocument>().populate(options?.populate);
    return document;
  }

  async find(filterQuery: FilterQuery<ReviewDocument> = {},
    options?: QueryOptions & {populate?: PopulateOptions | PopulateOptions[]}): Promise<ReviewDocument[]> {
    const documents = await this.model.find(filterQuery).lean<ReviewDocument[]>().sort(options?.sort).skip(options?.skip).limit(options?.limit).populate(options?.populate);
    return documents;
  }
}