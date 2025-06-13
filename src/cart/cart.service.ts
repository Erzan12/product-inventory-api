import { Injectable } from "@nestjs/common";

export interface CartItem {
    productId: number;
    quantity: number;
    
}

@Injectable()
export class CartService {
    // key: userId, value: array of cart items
    private carts = new Map<number, CartItem[]>();

    getCart(userId: number): CartItem[] {
        return this.carts.get(userId) || [];
    }

    addToCart(userId: number, item: CartItem): CartItem[] {
        const cart = this.getCart(userId);
        const existing = cart.find(ci => ci.productId === item.productId);
        if (existing) {
            existing.quantity += item.quantity;
        } else {
            cart.push(item);
        }
        this.carts.set(userId, cart);
        return cart;
    }

    clearCart(userId: number): void {
        this.carts.delete(userId);
    }
}