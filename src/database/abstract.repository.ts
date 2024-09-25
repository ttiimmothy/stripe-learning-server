import {
  FilterQuery,
  Model,
  PopulateOptions,
  QueryOptions,
  Types,
  UpdateQuery,
} from 'mongoose';
import { NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<T> {
  constructor(public readonly model: Model<T>) {}

  async create(document: Omit<T, '_id'>): Promise<T> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as T;
  }

  async findOne(filterQuery: FilterQuery<T>): Promise<T> {
    return await this.model.findOne(filterQuery).lean<T>();
  }

  async findById(
    id: string,
    projection?: string | Record<string, any>,
    options?: QueryOptions & { populate?: PopulateOptions | PopulateOptions[] },
  ): Promise<T> {
    return await this.model
      .findById(id)
      .select(projection)
      .lean<T>()
      .populate(options?.populate);
  }
  async find(
    filterQuery: FilterQuery<T>,
    projection?: string | Record<string, any>,
    options?: QueryOptions & { populate?: PopulateOptions | PopulateOptions[] },
  ): Promise<T[]> {
    const documents = await this.model
      .find(filterQuery)
      .select(projection)
      .lean<T[]>()
      .sort(options?.sort)
      .skip(options?.skip)
      .limit(options?.limit)
      .populate(options?.populate);
    if (!documents) {
      throw new NotFoundException('Documents not found.'); // 404
    }
    return documents;
  }

  async findByIdAndUpdate(
    id: string | Types.ObjectId,
    update: UpdateQuery<T>,
  ): Promise<T> {
    return await this.model
      .findByIdAndUpdate(id, update, { new: true })
      .lean<T>();
  }

  async findByIdAndDelete(id: string | Types.ObjectId): Promise<T> {
    return await this.model.findByIdAndDelete(id).lean<T>();
  }

  async deleteMany(filterQuery: FilterQuery<T>): Promise<T> {
    return await this.model.deleteMany(filterQuery).lean<T>();
  }

  async countDocuments(filter: any): Promise<number> {
    return this.model.countDocuments(filter);
  }
}
