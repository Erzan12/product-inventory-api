import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export interface ChangeInfo {
    from: string;
    lastMonthValue: string;
    change: string;
    amount: string;
    percentage: string;
}

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) {}

    async getInventoryAnalytics() {
        const products = await this.prisma.product.findMany();

        const totalProducts = products.length;
        const totalUnits = products.reduce((sum, p) => sum + p.quantity, 0);
        const totalValueNumber = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

        //Format current total value
        const totalValueFormatted =`₱${totalValueNumber.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

        // === Fetch last month's snapshots ==
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const snapshotKey = `${lastMonth.getFullYear()}-${(lastMonth.getMonth() + 1). toString().padStart(2, '0')}`;
        
        const lastMonthSnapshot = await this.prisma.inventorySnapshot.findUnique({
            where: { month: snapshotKey },
        });

        let changeInfo: ChangeInfo | null = null;

        if (lastMonthSnapshot) {
            const lastValue = lastMonthSnapshot.totalValue;
            const diff = totalValueNumber - lastValue;
            const rawPercentage = (diff / lastValue) * 100;

            changeInfo = {
                from: snapshotKey,
                lastMonthValue: `₱${lastValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                change: diff > 0 ? 'increase' : 'decrease',
                amount: `₱${Math.abs(diff).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                percentage: `${Math.abs(rawPercentage).toFixed(2)}%`,
            };
        }

        return {
            message: 'Current Inventory Overview',
            data: {
            totalProducts,
            totalUnits,
            totalValue: totalValueFormatted,
            comparison: changeInfo || 'No data for last month',
            },
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
