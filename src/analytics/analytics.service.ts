import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) {}

    async getInventoryAnalytics() {
        const products = await this.prisma.product.findMany();

        const totalProducts = products.length;
        const totalUnits = products.reduce((sum, p) => sum + p.quantity, 0);
        const totalValueNumber = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

        const totalValue =`₱${totalValueNumber.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
        
        return {
            totalProducts,
            totalUnits,
            totalValue,
        };
    }

    async getTopSellingProducts(limit = 5) {
        const bestSellers = await this.prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true,
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            },
            take:limit,
        });

        const withNames = await Promise.all(
            bestSellers.map(async (item) => {
                const product = await this.prisma.product.findUnique({
                    where: { id: item.productId },
                });

                return {
                    productId: item.productId,
                    name: product?.name,
                    totalSold: item._sum.quantity,
                };
            }),
        );

        return withNames
    }
}
