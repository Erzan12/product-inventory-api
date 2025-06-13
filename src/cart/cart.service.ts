import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class CartService {
    // key: userId, value: array of cart items
    constructor(private prisma: PrismaService) {}

    async viewCart(userId: number) {
    return this.prisma.cartItem.findMany({
        where: { userId },
        include: { product: true },
    });
    }

    async addToCart(userId: number, productId: number, quantity: number) {
    
    console.log('Adding to cart:', { userId, productId, quantity }); // Debug log

    const existing = await this.prisma.cartItem.findUnique({
        where: { userId_productId: { userId, productId } },
    });

    if (existing) {
        // If item already in cart, increase quantity
        return this.prisma.cartItem.update({
        where: { userId_productId: { userId, productId } },
        data: { quantity: existing.quantity + quantity },
        });
    }

    return this.prisma.cartItem.create({
        data: { userId, productId, quantity },
    });
    }

    async updateQuantity(id: number, quantity: number) {
        return this.prisma.cartItem.update({
            where: { id },
            data: { quantity },
        });
    }

    async removeFromCart(id: number) {
    return this.prisma.cartItem.delete({ where: { id } });
    }
}