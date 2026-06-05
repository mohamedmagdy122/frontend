import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { OrderService, Order } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create an order', () => {
    const mockOrder: Order = {
      id: 1, userId: 1, status: 'Pending', total: 59.98,
      createdAt: '2026-01-01', items: []
    };

    service.createOrder([{ productId: 1, quantity: 2 }]).subscribe(order => {
      expect(order.id).toBe(1);
      expect(order.status).toBe('Pending');
    });

    const req = httpMock.expectOne('/api/orders');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ items: [{ productId: 1, quantity: 2 }] });
    req.flush(mockOrder);
  });

  it('should get my orders', () => {
    const mockOrders: Order[] = [
      { id: 1, userId: 1, status: 'Pending', total: 29.99, createdAt: '2026-01-01', items: [] }
    ];

    service.getMyOrders().subscribe(orders => {
      expect(orders.length).toBe(1);
    });

    const req = httpMock.expectOne('/api/orders');
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);
  });

  it('should get order by id', () => {
    const mockOrder: Order = {
      id: 5, userId: 1, status: 'Pending', total: 10,
      createdAt: '2026-01-01', items: []
    };

    service.getOrder(5).subscribe(order => {
      expect(order.id).toBe(5);
    });

    const req = httpMock.expectOne('/api/orders/5');
    expect(req.request.method).toBe('GET');
    req.flush(mockOrder);
  });

  it('should cancel an order', () => {
    const mockOrder: Order = {
      id: 1, userId: 1, status: 'Cancelled', total: 29.99,
      createdAt: '2026-01-01', items: []
    };

    service.cancelOrder(1).subscribe(order => {
      expect(order.status).toBe('Cancelled');
    });

    const req = httpMock.expectOne('/api/orders/1/cancel');
    expect(req.request.method).toBe('PATCH');
    req.flush(mockOrder);
  });

  it('should delete a cancelled order', () => {
    service.deleteOrder(1).subscribe();

    const req = httpMock.expectOne('/api/orders/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});
