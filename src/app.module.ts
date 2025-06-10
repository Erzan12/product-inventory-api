import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ProductModule, CategoryModule, PrismaModule, AuthModule],
  providers: [PrismaService],
})
export class AppModule {}
