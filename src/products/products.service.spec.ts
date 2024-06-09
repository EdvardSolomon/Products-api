// src/products/products.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto';
import { Product } from '@prisma/client';

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              findMany: jest.fn().mockResolvedValue([]),
              findUnique: jest.fn().mockResolvedValue(null),
              create: jest.fn().mockResolvedValue({}),
              update: jest.fn().mockResolvedValue({}),
              delete: jest.fn().mockResolvedValue({}),
              count: jest.fn().mockResolvedValue(0),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('findAll', () => {
    it('should return pagination list of products', async () => {
      const result = { items: [], total: 0, page: 1, limit: 10 };
      jest
        .spyOn(prismaService.product, 'findMany')
        .mockResolvedValue(result.items);
      jest
        .spyOn(prismaService.product, 'count')
        .mockResolvedValue(result.total);

      const paginationQuery = { page: 1, limit: 10 };
      expect(await service.findAll(paginationQuery)).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return product, if find', async () => {
      const product = { id: 1, name: 'Test Product' } as Product;
      jest
        .spyOn(prismaService.product, 'findUnique')
        .mockResolvedValue(product);

      expect(await service.findOne(1)).toEqual(product);
    });

    it('should throw NotFoundException, if product not found', async () => {
      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(
        new NotFoundException('Product with ID 1 not found'),
      );
    });
  });

  describe('create', () => {
    it('should create and return product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'New Product',
        category: 'Category',
        description: 'Desc',
        price: 100,
      };
      const product = { id: 1, ...createProductDto } as Product;
      jest.spyOn(prismaService.product, 'create').mockResolvedValue(product);

      expect(await service.create(createProductDto)).toEqual(product);
    });

    it('should throw BadRequestException on invalid data', async () => {
      const createProductDto: any = { name: '' };

      jest.spyOn(prismaService.product, 'create').mockImplementation(() => {
        throw new BadRequestException('Invalid product data');
      });

      await expect(service.create(createProductDto)).rejects.toThrow(
        new BadRequestException('Invalid product data'),
      );
    });
  });

  describe('update', () => {
    it('should update and return product, if find', async () => {
      const product = { id: 1, name: 'Updated Product' } as Product;
      jest.spyOn(prismaService.product, 'update').mockResolvedValue(product);

      expect(await service.update(1, { name: 'Updated Product' })).toEqual(
        product,
      );
    });

    it('should throw NotFoundException, if product not found', async () => {
      jest.spyOn(prismaService.product, 'update').mockRejectedValue({
        code: 'P2025',
      });

      await expect(
        service.update(1, { name: 'Updated Product' }),
      ).rejects.toThrow(new NotFoundException('Product with ID 1 not found'));
    });
  });

  describe('remove', () => {
    it('should delete product', async () => {
      jest
        .spyOn(prismaService.product, 'delete')
        .mockResolvedValue({ id: 1 } as Product);

      await expect(service.remove(1)).resolves.not.toThrow();
    });

    it('shoud throw NotFoundException, if product not found', async () => {
      jest.spyOn(prismaService.product, 'delete').mockRejectedValue({
        code: 'P2025',
      });

      await expect(service.remove(1)).rejects.toThrow(
        new NotFoundException('Product with ID 1 not found'),
      );
    });
  });
});
