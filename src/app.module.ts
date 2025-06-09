import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [ProductModule],
  providers: [PrismaService],
})
export class AppModule {}
