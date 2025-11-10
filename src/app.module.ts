// app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config'; // <-- Import ConfigService

@Module({
  imports: [
    AuthModule,
    UserModule, // 1. Configure ConfigModule to load your file
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local', // <--- TELL IT TO USE YOUR FILE
    }), // 2. Use forRootAsync to wait for ConfigModule to load
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        // Use ConfigService to safely retrieve the variable
        uri: configService.get<string>('MONGODB_URL'),
      }),
      inject: [ConfigService], // Inject the service
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
