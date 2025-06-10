import { IsString, IsOptional, IsNumber, Min, IsPositive, IsInt } from 'class-validator'

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  categoryId: number; // required for connect
}
