// src/order/order.module.ts
import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { CartService } from '../cart/cart.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService, CartService],
})
export class OrderModule {}
