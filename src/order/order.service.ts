// src/order/order.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto, OrderStatus } from './dto/update-order-status.dto';
import { CartService } from 'src/cart/cart.service';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService, private cartService: CartService) {}

  //get all user orders (admin role)
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

  // async createOrder(userId: number, dto: CreateOrderDto) {

  //   //validate if product exist before order
  //   const productIds = dto.items.map(item => item.productId);
  //   const products = await this.prisma.product.findMany({
  //     where: { id: { in: productIds } },
  //     select: { id: true },
  //   });

  //   const existingIds = new Set(products.map(p => p.id));
  //   const invalidIds = productIds.filter(id => !existingIds.has(id));

  //   if (invalidIds.length > 0) {
  //     throw new BadRequestException(`Invalid productId(s): ${invalidIds.join(', ')}`);
  //   }
    
  //   // Create order with related items in a single transaction
  //   const order = await this.prisma.order.create({
  //     data: {
  //       userId,
  //       items: {
  //         create: dto.items.map(item => ({
  //           productId: item.productId,
  //           quantity: item.quantity,
  //           price: item.price,
  //         })),
  //       },
  //     },
  //     include: {
  //       items: true,
  //     },
  //   });

  //   return order;
  // }

  async UpdateOrderStatus(orderId: number, dto: UpdateOrderStatusDto) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: dto.status },
    })
  }

  //check out or order item
  async checkout(userId: number) {

    if (!userId) {
        throw new BadRequestException('User ID is missing');
      }

      const cartItems = await this.cartService.viewCart(userId);
      if (cartItems.length === 0) {
        throw new BadRequestException('Cart is empty');
      }
      
      return this.prisma.$transaction(async (tx) => {
      // Validate stock first
      for (const item of cartItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product ID ${item.productId} not found`);
        }

        if (item.quantity > product.quantity) {
          throw new BadRequestException(
            `Not enough stock for "${product.name}". Available: ${product.quantity}`
          );
        }
      }

      const order = await this.prisma.order.create({
        data: {
          userId,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });

          // Decrement product quantities
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: { decrement: item.quantity },
          },
        });
      }

      //optional but helpful, to clear the cart after ordering
      await this.prisma.cartItem.deleteMany({ where: {userId} });

      return order;

    });
  }

  //get users orders
  async getMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  //getOrderhistoryByProduct (User)
  async getOrderHistoryByProduct(productId: number) {
    return this.prisma.orderItem.findMany({
      where: { productId },
      include: {
        order: {
          select: {
            id:true,
            user: { select: { id: true, email: true } },
            createdAt: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { 
        order: {
          createdAt: 'desc', // sort by the order.createAt
        },
      },
    });
  }
}
