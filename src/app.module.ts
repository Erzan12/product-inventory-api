import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [ProductModule, CategoryModule, PrismaModule, AuthModule, OrderModule, CartModule],
  providers: [PrismaService],
})
export class AppModule {}
