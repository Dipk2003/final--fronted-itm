import '@testing-library/jest-dom';
import { server } from '../mocks/server';

beforeAll(() => {
  // Enable API mocking before tests
  server.listen();
});

afterEach(() => {
  // Reset request handlers between tests
  server.resetHandlers();
});

afterAll(() => {
  // Clean up after tests
  server.close();
});
