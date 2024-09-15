import { AbstractRepository } from "../database/abstract.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Review, ReviewDocument } from "./review.model";
import { Model, Types } from "mongoose";
import { Injectable } from "@nestjs/common";
@Injectable()
export class ReviewRepository extends AbstractRepository<ReviewDocument> {
  constructor(@InjectModel(Review.name) reviewModel: Model<ReviewDocument>) {
    super(reviewModel);
  }
}