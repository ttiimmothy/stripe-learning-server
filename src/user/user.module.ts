import { Module } from '@nestjs/common';
// import { UserController } from './user.controller';
import { UserService } from './user.service';
// import verifyToken from '../middleware/verifyToken';
import { UserResolver } from './user.resolver';
import { UserRepository } from './user.repository';
import { User, userSchema } from './user.model';
// import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '../database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: User.name, schema: userSchema }]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UserService, UserResolver, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
