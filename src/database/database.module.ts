import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
// import { DbMigrationService } from './db-migration.service';
import { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('DB_URL'),
        connectionFactory: (connection: Connection) => {
          connection.on('connected', () => {
            console.log('connected to mongodb');
          });
          connection.on('error', (error) => {
            console.error('Error connecting to mongodb:', error);
          });
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [Connection],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private connection: Connection) {}

  onModuleInit() {
    console.log('mongodb connection state:', this.connection.readyState);
  }

  static forFeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models);
  }
}
