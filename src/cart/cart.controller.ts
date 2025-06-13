import { Controller, Delete, Post, Get, Patch, Request, Param, Body, BadRequestException } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('api/orders/cart')
export class CartController {
    constructor ( private readonly cartService: CartService) {}
    @Post()
    async addToCart(@Request() req, @Body() body: { productId: number; quantity: number }) {
    const userId = req.user?.userId;

    if (!userId || !body.productId) {
        throw new BadRequestException('Missing userId or productId');
    }

    return this.cartService.addToCart(userId, body.productId, body.quantity);
    }

    @Get()
    viewCart(@Request() req) {
    const userId = req.user.id;
    return this.cartService.viewCart(userId);
    }

    @Patch(':id')
    updateQuantity(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.cartService.updateQuantity(+id, quantity);
    }

    @Delete(':id')
    removeFromCart(@Param('id') id: string) {
    return this.cartService.removeFromCart(+id);
    }
}
