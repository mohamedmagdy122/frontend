import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CatalogService, Product } from './catalog.service';

describe('CatalogService', () => {
  let service: CatalogService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CatalogService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CatalogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get all products', () => {
    service.getProducts().subscribe(products => {
      expect(products.length).toBe(2);
    });

    const req = httpMock.expectOne('/api/catalog/products');
    expect(req.request.method).toBe('GET');
    req.flush([
      { id: 1, name: 'Mouse' },
      { id: 2, name: 'Keyboard' }
    ]);
  });

  it('should get products by category', () => {
    service.getProducts(1).subscribe();

    const req = httpMock.expectOne('/api/catalog/products?categoryId=1');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get single product', () => {
    service.getProduct(1).subscribe(product => {
      expect(product.name).toBe('Wireless Mouse');
    });

    const req = httpMock.expectOne('/api/catalog/products/1');
    expect(req.request.method).toBe('GET');
    req.flush({ id: 1, name: 'Wireless Mouse' });
  });

  it('should search products', () => {
    service.searchProducts('mouse').subscribe(products => {
      expect(products.length).toBe(1);
    });

    const req = httpMock.expectOne('/api/catalog/products/search?q=mouse');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, name: 'Wireless Mouse' }]);
  });

  it('should get categories', () => {
    service.getCategories().subscribe(cats => {
      expect(cats.length).toBe(2);
    });

    const req = httpMock.expectOne('/api/catalog/categories');
    expect(req.request.method).toBe('GET');
    req.flush([
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Books' }
    ]);
  });
});
