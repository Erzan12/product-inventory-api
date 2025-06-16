import { Injectable, NotFoundException, HttpException, HttpStatus  } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RESPONSE_MESSAGES } from 'src/common/constants/response-messages.constant';
import { buildErrorResponse } from 'src/common/helpers/response-helper';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(data: CreateProductDto) {
    try {
      return await this.prisma.product.create({ data });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError && 
        error.code === 'P2003'
      ) {
        throw new HttpException(
          buildErrorResponse(
            RESPONSE_MESSAGES.PRODUCT.CATEGORY_NOT_FOUND,
            'ForeignKeyViolation',
            HttpStatus.BAD_REQUEST,
          ),
          HttpStatus.BAD_REQUEST,
        );
      }

      throw error;
    }
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

  //Admin restock product
  async restockProduct(productId: number, quantity: number) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        quantity: product.quantity + quantity,
      },
    });
  }
}
