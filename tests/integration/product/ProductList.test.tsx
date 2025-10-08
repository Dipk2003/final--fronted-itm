import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProductList from '@/modules/vendor/components/ProductList';
// import { server } from '../../mocks/server'; // Commented out due to MSW setup issues
import { http, HttpResponse } from 'msw';

// Mock the productAPI module
jest.mock('@/shared/services/productApi', () => ({
  productAPI: {
    getMyProducts: jest.fn(() => Promise.resolve({
      content: [
        {
          id: 1,
          name: 'Test Product 1',
          description: 'Test Description 1',
          price: 100,
          stock: 10,
          unit: 'pcs',
          category: { name: 'Category 1' },
          isActive: true,
          status: 'APPROVED',
          viewCount: 5,
          images: [],
          imageUrls: ''
        },
        {
          id: 2,
          name: 'Test Product 2',
          description: 'Test Description 2',
          price: 200,
          stock: 5,
          unit: 'pcs',
          category: { name: 'Category 2' },
          isActive: true,
          status: 'APPROVED',
          viewCount: 10,
          images: [],
          imageUrls: ''
        }
      ],
      totalElements: 2,
      totalPages: 1,
      number: 0,
      size: 1000,
      first: true,
      last: true
    })),
    updateProductStatus: jest.fn(() => Promise.resolve()),
    deleteProduct: jest.fn(() => Promise.resolve())
  },
  Product: {}
}));

// Create a simple mock store since we don't have a product slice
const mockStore = configureStore({
  reducer: {
    // Add minimal auth state for the component
    auth: (state = { isAuthenticated: true, user: null }, action) => state
  }
});

describe('ProductList Component', () => {
  it('renders product list successfully', async () => {
    render(
      <Provider store={mockStore}>
        <ProductList />
      </Provider>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Check if prices are displayed
    expect(screen.getByText('₹100')).toBeInTheDocument();
    expect(screen.getByText('₹200')).toBeInTheDocument();

    // Check if categories are displayed
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
  });

  it('renders the header with product count', async () => {
    render(
      <Provider store={mockStore}>
        <ProductList />
      </Provider>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('My Products')).toBeInTheDocument();
      expect(screen.getByText('2 products total')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('renders product table with correct headers', async () => {
    render(
      <Provider store={mockStore}>
        <ProductList />
      </Provider>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Check table headers
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Stock')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Views')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('displays product status badges correctly', async () => {
    render(
      <Provider store={mockStore}>
        <ProductList />
      </Provider>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getAllByText('Approved')).toHaveLength(2);
    }, { timeout: 3000 });
  });

  it('shows loading state initially', async () => {
    render(
      <Provider store={mockStore}>
        <ProductList />
      </Provider>
    );

    // Should briefly show loading spinner
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    
    // Then products should load
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
