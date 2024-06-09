import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ProductsModule, AuthModule, PrismaModule, UsersModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
