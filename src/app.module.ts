import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [ProductModule, CategoryModule, PrismaModule],
  providers: [PrismaService],
})
export class AppModule {}
