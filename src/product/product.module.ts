import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import verifyToken from "../middleware/verifyToken";
import {ProductResolver} from "./product.resolver";
import {ProductRepository} from "./product.repository";
import {Product, productSchema} from "./product.model";
import {MongooseModule} from "@nestjs/mongoose";
import {DatabaseModule} from "../database/database.module";
import {JwtModule} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {ObjectIdPipe} from "./product.pipe";
import {ReviewRepository} from "../review/review.repository";
import {ReviewModule} from "../review/review.module";
import {UserModule} from "../user/user.module";
import {AuthGuard} from "../auth/auth.guard";
import {AuthAdminGuard} from "../auth/authAdmin.guard";

@Module({
  imports: [DatabaseModule.forFeature([{ name: Product.name, schema: productSchema }]), forwardRef(() => ReviewModule), UserModule],
  providers: [ProductService, ProductResolver, ProductRepository],
  exports: [ProductRepository],
})
export class ProductModule {}