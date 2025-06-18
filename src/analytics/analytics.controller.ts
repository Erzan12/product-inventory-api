import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('api/analytics')
export class AnalyticsController {
    constructor( private analyticsService: AnalyticsService) {}

    @Get('inventory')
    async getInventoryStats() {
        const inventoryValue = await this.analyticsService.getInventoryAnalytics();
            return {
                message: 'Current Inventory Overview',
                data: inventoryValue,
            }
    }

    @Get('top-products')
    async getTopSelling() {
       const topProducts = await this.analyticsService.getTopSellingProducts();
        return {
            message: 'Top Products of All Time',
            data: topProducts,
        };
    }
}
