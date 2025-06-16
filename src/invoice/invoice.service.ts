import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { RESPONSE_MESSAGES } from 'src/common/constants/response-messages.constant';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InvoiceService {
    constructor(private prisma: PrismaService) {}

    async generateInvoice(orderId: number) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: true,
                items: {
                    include: { product: true },
                },
            },
        });

        if (!order) {
            throw new NotFoundException({ message: RESPONSE_MESSAGES.ORDERS.ORDER_NOT_FOUND})
        }

        // ❗ Reject invoice if order is still pending
        if (order.status === 'pending') {
            throw new BadRequestException({
            message: RESPONSE_MESSAGES.INVOICES.ORDER_PAYMENT_PENDING,
            status: 'InvoiceGenerationRejected',
            });
        }

        const total = order.items.reduce((sum, item) => {
            return sum + item.quantity * item.price;
        }, 0);

        return {
            orderId: order.id,
            customerEmail: order.user.email,
            date: order.createdAt,
            items: order.items.map((item) => ({
                name: item.product.name,
                quantity: item.quantity,
                unitPrice: item.price,
                totatPrice: item.quantity * item.price,
            })),
            total,
            status: order.status,
        };
    }
}
