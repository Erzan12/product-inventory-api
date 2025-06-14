import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateProductDto) {
      return this.prisma.product.create({
        data,
        include: { category: true },
      });
  }

  findAll() {
    return this.prisma.product.findMany({
      include: { category: true },
    });
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  update(id: number, data: UpdateProductDto) {
    return this.prisma.product.update({
       where: { id },
       data,
       include: { category: true },
   });
  }

  remove(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
