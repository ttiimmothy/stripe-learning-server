import {Injectable} from "@nestjs/common";
import {Order} from "./order.model";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {AbstractRepository} from "../database/abstract.repository";

@Injectable()
export class OrderRepository extends AbstractRepository<Order> {
  constructor(@InjectModel(Order.name) orderModel: Model<Order>) {
    super(orderModel);
  }
}