// src/order/order.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto, OrderStatus } from './dto/update-order-status.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async getAllOrders() {
    return this.prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc'},
    });
  }

  async getUserOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc'},
    });
  }

  async createOrder(userId: number, dto: CreateOrderDto) {

    //validate if product exist before order
    const productIds = dto.items.map(item => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true },
    });

    const existingIds = new Set(products.map(p => p.id));
    const invalidIds = productIds.filter(id => !existingIds.has(id));

    if (invalidIds.length > 0) {
      throw new BadRequestException(`Invalid productId(s): ${invalidIds.join(', ')}`);
    }
    
    // Create order with related items in a single transaction
    const order = await this.prisma.order.create({
      data: {
        userId,
        items: {
          create: dto.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return order;
  }

  async UpdateOrderStatus(orderId: number, dto: UpdateOrderStatusDto) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: dto.status },
    })
  }

  //check out
  async checkout(userId: number, cart: { productId: number; quantity: number }[]) {
    const order = await this.prisma.order.create({
      data: {
        userId,
        items: {
          create: await Promise.all(cart.map(async item => {
            const product = await this.prisma.product.findUnique({
              where: { id: item.productId },
            });
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product?.price || 0,
            };
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return order;
  }
}
