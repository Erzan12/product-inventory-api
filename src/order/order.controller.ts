// src/order/order.controller.ts
import { Controller, Post, Body, Request, Patch, Param, Get, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Roles } from '../auth/roles.decorator';
// import { Role } from '../auth/role.enum';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('api/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Roles('admin')
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Patch(':id/status')
  @Roles('admin')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orderService.UpdateOrderStatus(Number(id), dto);
  }

  //customer side on orders and checkout 
  // @Get('my')
  // async getMyOrders(@Request() req) {
  //   console.log('req.user:', req.user);
  //   return this. orderService.getUserOrders(req.user.userId);
  // }
  
  // @Post()
  // create(@Body() dto: CreateOrderDto, @Request() req) {
  //   const userId = req.user.userId; // extracted from token
  //   return this.orderService.createOrder(userId, dto);
  // }

  @Get('my')
  async getMyOrders(@Req() req) {
    const userId = req.user.userId;
    console.log('req.user:', req.user);
    return this.orderService.getMyOrders(userId);
  }

  @Post('checkout')
  checkout(@Request() req) {
    console.log('req.user:', req.user);
    return this.orderService.checkout(req.user.userId);
  }
}



