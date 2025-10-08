import { http, HttpResponse } from 'msw';

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      token: 'mock-jwt-token',
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User'
      }
    });
  }),

  http.post('/api/auth/register', () => {
    return HttpResponse.json({
      message: 'User registered successfully'
    }, { status: 201 });
  }),

  // Product endpoints
  http.get('/api/products', () => {
    return HttpResponse.json({
      products: [
        {
          id: '1',
          name: 'Test Product 1',
          description: 'Description 1',
          price: 100,
          category: 'Category 1'
        },
        {
          id: '2',
          name: 'Test Product 2',
          description: 'Description 2',
          price: 200,
          category: 'Category 2'
        }
      ],
      total: 2,
      page: 1,
      perPage: 10
    });
  }),

  http.get('/api/products/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      id,
      name: `Test Product ${id}`,
      description: `Description ${id}`,
      price: 100,
      category: 'Test Category'
    });
  }),

  // All other endpoints converted to http
  http.get('/api/categories', () => HttpResponse.json({ categories: [] })),
  http.get('/api/orders', () => HttpResponse.json({ orders: [], total: 0 })),
  http.post('/api/orders', () => HttpResponse.json({ id: '3', status: 'PENDING' }, { status: 201 })),
  http.get('/api/cart', () => HttpResponse.json({ items: [], total: 0 })),
  http.post('/api/cart/add', () => HttpResponse.json({ message: 'Item added' })),
  http.get('/api/user/profile', () => HttpResponse.json({ id: '1', name: 'Test User' })),
  http.put('/api/user/profile', () => HttpResponse.json({ message: 'Updated' })),
  http.get('/api/vendors', () => HttpResponse.json({ vendors: [], total: 0 })),
  http.get('/api/vendors/:id', ({ params }) => HttpResponse.json({ id: params.id, name: `Vendor ${params.id}` })),
  http.get('/api/search', () => HttpResponse.json({ products: [], total: 0 })),
  http.get('/api/analytics/dashboard', () => HttpResponse.json({ totalOrders: 1000, totalRevenue: 50000 }))
];
