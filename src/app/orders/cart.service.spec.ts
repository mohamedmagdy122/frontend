import { CartService } from './cart.service';
import { Product } from '../catalog/catalog.service';

describe('CartService', () => {
  let service: CartService;

  const mockProduct: Product = {
    id: 1,
    name: 'Wireless Mouse',
    description: 'Ergonomic',
    price: 29.99,
    stock: 100,
    categoryId: 1,
    imageUrl: null,
    category: null
  };

  const mockProduct2: Product = {
    id: 2,
    name: 'Keyboard',
    description: 'Mechanical',
    price: 79.99,
    stock: 50,
    categoryId: 1,
    imageUrl: null,
    category: null
  };

  beforeEach(() => {
    service = new CartService();
  });

  it('should start with empty cart', () => {
    expect(service.getItems()).toEqual([]);
    expect(service.getItemCount()).toBe(0);
    expect(service.getTotal()).toBe(0);
  });

  it('should add item to cart', () => {
    service.addItem(mockProduct);
    expect(service.getItems().length).toBe(1);
    expect(service.getItems()[0].product.name).toBe('Wireless Mouse');
    expect(service.getItems()[0].quantity).toBe(1);
  });

  it('should increment quantity when adding same product', () => {
    service.addItem(mockProduct);
    service.addItem(mockProduct);
    expect(service.getItems().length).toBe(1);
    expect(service.getItems()[0].quantity).toBe(2);
  });

  it('should add custom quantity', () => {
    service.addItem(mockProduct, 3);
    expect(service.getItems()[0].quantity).toBe(3);
  });

  it('should remove item from cart', () => {
    service.addItem(mockProduct);
    service.addItem(mockProduct2);
    service.removeItem(1);
    expect(service.getItems().length).toBe(1);
    expect(service.getItems()[0].product.id).toBe(2);
  });

  it('should update quantity', () => {
    service.addItem(mockProduct);
    service.updateQuantity(1, 5);
    expect(service.getItems()[0].quantity).toBe(5);
  });

  it('should not set quantity below 1', () => {
    service.addItem(mockProduct);
    service.updateQuantity(1, 0);
    expect(service.getItems()[0].quantity).toBe(1);
  });

  it('should calculate total correctly', () => {
    service.addItem(mockProduct, 2);   // 29.99 * 2 = 59.98
    service.addItem(mockProduct2, 1);  // 79.99 * 1 = 79.99
    expect(service.getTotal()).toBeCloseTo(139.97, 2);
  });

  it('should calculate item count correctly', () => {
    service.addItem(mockProduct, 2);
    service.addItem(mockProduct2, 3);
    expect(service.getItemCount()).toBe(5);
  });

  it('should clear all items', () => {
    service.addItem(mockProduct);
    service.addItem(mockProduct2);
    service.clear();
    expect(service.getItems()).toEqual([]);
    expect(service.getItemCount()).toBe(0);
  });
});
