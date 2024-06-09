import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateProductDto, UpdateProductDto } from './dto';
import {
  ApiNotFoundResponse,
  ApiSuccessResponse,
  ApiUnauthorizedResponse,
} from '../common/decorators';
import { ProductEntity } from './entities/product.entity';
import { PaginationQueryDto, PaginationResultDto } from '../common/dto';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Get all products with pagination' })
  @ApiSuccessResponse(
    PaginationResultDto<ProductEntity>,
    'Paginated list of products',
  )
  @ApiUnauthorizedResponse('Unauthorized')
  @Get()
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginationResultDto<Product>> {
    return this.productsService.findAll(paginationQuery);
  }

  @ApiOperation({ summary: 'Get product by ID' })
  @ApiSuccessResponse(ProductEntity, 'The found product')
  @ApiNotFoundResponse('Product not found')
  @ApiUnauthorizedResponse('Unauthorized')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new product' })
  @ApiSuccessResponse(ProductEntity, 'The created product')
  @ApiUnauthorizedResponse('Unauthorized')
  @Post()
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Update product by ID' })
  @ApiSuccessResponse(ProductEntity, 'The updated product')
  @ApiNotFoundResponse('Product not found')
  @ApiUnauthorizedResponse('Unauthorized')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete product by ID' })
  @ApiSuccessResponse(ProductEntity, 'The deleted product')
  @ApiNotFoundResponse('Product not found')
  @ApiUnauthorizedResponse('Unauthorized')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productsService.remove(id);
  }
}
