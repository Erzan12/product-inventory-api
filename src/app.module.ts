import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { ConfigModule } from '@nestjs/config';
import { InvoiceService } from './invoice/invoice.service';
import { InvoiceModule } from './invoice/invoice.module';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { AnalyticsService } from './analytics/analytics.service';
import { AnalyticsController } from './analytics/analytics.controller';
import { AnalyticsModule } from './analytics/analytics.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ 
            ProductModule,
            CategoryModule,
            PrismaModule, 
            AuthModule, 
            OrderModule, 
            CartModule,  
            ScheduleModule.forRoot(),
            ConfigModule.forRoot({isGlobal: true, // makes config available everywhere
            }), InvoiceModule, MailModule, AnalyticsModule
          ],
  providers: [PrismaService, InvoiceService, MailService, AnalyticsService],
  controllers: [AnalyticsController],
})
export class AppModule {}
