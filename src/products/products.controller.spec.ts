import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PaginationResultDto } from '../common/dto';
import { Product } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return pagination list of products', async () => {
      const result: PaginationResultDto<Product> = {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
      };
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll({ page: 1, limit: 10 })).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return product by ID', async () => {
      const result: Product = { id: 1, name: 'Test Product' } as Product;
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(1)).toBe(result);
    });

    it('should throw NotFoundException, if product not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
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
      const result: Product = { id: 1, name: 'New Product' } as Product;
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createProductDto)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update and return product, by ID', async () => {
      const updateProductDto: UpdateProductDto = { name: 'Updated Product' };
      const result: Product = { id: 1, name: 'Updated Product' } as Product;
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(1, updateProductDto)).toBe(result);
    });

    it('should throw NotFoundException, if product not found', async () => {
      const updateProductDto: UpdateProductDto = { name: 'Updated Product' };
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(controller.update(1, updateProductDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete product by ID', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await expect(controller.remove(1)).resolves.not.toThrow();
    });

    it('shoud throw NotFoundException, if product not found', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());

      await expect(controller.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
