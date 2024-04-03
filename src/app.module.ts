import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [
    // Importing configuration module for managing environment variables
    ConfigModule.forRoot(),

    // Setting up TypeORM module with asynchronous configuration for connecting to the database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Importing ConfigModule to access environment variables
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'), // Database host from environment variables
        port: parseInt(configService.get('DB_PORT')), // Database port from environment variables
        username: configService.get('DB_USERNAME'), // Database username from environment variables
        password: configService.get('DB_PASSWORD'), // Database password from environment variables
        database: configService.get('DB_NAME'), // Database name from environment variables
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // Entities path
        synchronize: true, // Synchronize database schema with entities
      }),
      inject: [ConfigService], // Injecting ConfigService to access environment variables
    }),

    // Importing feature modules for Books and Customers
    BooksModule,
    CustomersModule,
  ],
  controllers: [AppController], // Declaring the controller
  providers: [AppService], // Declaring the service
})
export class AppModule {}
