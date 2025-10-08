# Employee Module

The Employee Module provides a comprehensive data management interface for employees to manage the core reference data that powers the Indian Trade Mart website.

## Overview

This module allows employees to:

- **Category Management**: Create, read, update, and delete product categories, subcategories, and micro-categories
- **Location Management**: Manage states and cities that appear in location dropdowns
- **Data Analytics**: View statistics and health metrics for the managed data

## Features

### 🏠 Dashboard Overview
- Real-time statistics for categories and locations
- System health monitoring
- Recent activity tracking
- Quick action buttons

### 📋 Category Management
- **Hierarchical Structure**: Main → Sub → Micro categories
- **CRUD Operations**: Create, read, update, delete categories
- **Bulk Operations**: Import/export, bulk edit, bulk delete
- **Search & Filter**: Advanced search with level and parent filters
- **SEO Optimization**: SEO title and description fields
- **Status Management**: Activate/deactivate categories
- **Sort Ordering**: Custom sort order management

### 📍 Location Management
- **State Management**: Add/edit Indian states with codes
- **City Management**: Add cities under respective states
- **Bulk Operations**: Import/export locations
- **Search & Filter**: Search with state filtering
- **Status Management**: Activate/deactivate locations

## API Endpoints

The module expects the following backend API endpoints to be available:

### Employee APIs
```
GET    /api/employee/profile
PUT    /api/employee/profile
GET    /api/employee/stats
GET    /api/employee/dashboard
GET    /api/employee/activity-logs
GET    /api/employee/system-health
```

### Category Management APIs
```
GET    /api/employee/categories/hierarchy
GET    /api/employee/categories (paginated)
GET    /api/employee/categories/:id
POST   /api/employee/categories
PUT    /api/employee/categories/:id
DELETE /api/employee/categories/:id
PATCH  /api/employee/categories/:id/toggle-status
GET    /api/employee/categories/main
GET    /api/employee/categories/:id/subcategories
GET    /api/employee/categories/search
PATCH  /api/employee/categories/reorder
PATCH  /api/employee/categories/bulk-update
DELETE /api/employee/categories/bulk-delete
GET    /api/employee/categories/stats
```

### Location Management APIs
```
GET    /api/employee/states
GET    /api/employee/states/paginated
GET    /api/employee/states/:id
POST   /api/employee/states
PUT    /api/employee/states/:id
DELETE /api/employee/states/:id
PATCH  /api/employee/states/:id/toggle-status
GET    /api/employee/cities
GET    /api/employee/cities/paginated
GET    /api/employee/states/:id/cities
POST   /api/employee/cities
PUT    /api/employee/cities/:id
DELETE /api/employee/cities/:id
PATCH  /api/employee/cities/:id/toggle-status
GET    /api/employee/locations/stats
```

## Data Models

### Category
```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  level: 'main' | 'sub' | 'micro';
  isActive: boolean;
  sortOrder: number;
  icon?: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
  subcategories?: Category[];
}
```

### State
```typescript
interface State {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  cities?: City[];
}
```

### City
```typescript
interface City {
  id: string;
  name: string;
  stateId: string;
  stateName?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
```

## Components Structure

```
src/modules/employee/
├── components/
│   ├── EmployeeDashboard.tsx          # Main dashboard wrapper
│   ├── EmployeeDashboardTabs.tsx      # Tab navigation
│   ├── DataManagementOverview.tsx     # Overview/stats page
│   ├── CategoryManagement.tsx         # Category management page
│   ├── CategoryTable.tsx              # Category data table
│   ├── CategoryForm.tsx               # Category create/edit form
│   ├── LocationManagement.tsx         # Location management page
│   ├── LocationTable.tsx              # Location data table
│   └── LocationForm.tsx               # Location create/edit form
├── services/
│   ├── employeeApi.ts                 # Employee profile/stats APIs
│   ├── categoryManagementApi.ts       # Category CRUD APIs
│   └── locationManagementApi.ts       # Location CRUD APIs
├── types/
│   └── employee.ts                    # TypeScript type definitions
└── index.ts                           # Module exports
```

## Usage

### Accessing the Employee Dashboard

1. **Login**: Navigate to `/auth/employee/login`
2. **Dashboard**: After login, access `/dashboard/employee`

### Using the Components

```tsx
import { EmployeeDashboard } from '@/modules/employee';

export default function EmployeePage() {
  return <EmployeeDashboard />;
}
```

## Permissions

The module supports role-based permissions:

```typescript
interface EmployeePermissions {
  canCreateCategories: boolean;
  canUpdateCategories: boolean;
  canDeleteCategories: boolean;
  canCreateLocations: boolean;
  canUpdateLocations: boolean;
  canDeleteLocations: boolean;
  canViewAnalytics: boolean;
}
```

## Key Features

### Search & Filtering
- Real-time search across categories and locations
- Advanced filtering by level, parent, status
- Pagination with configurable page sizes

### Data Validation
- Required field validation
- Unique slug validation for categories
- State code format validation
- Sort order numeric validation

### User Experience
- Responsive design for mobile and desktop
- Loading states and error handling
- Confirmation dialogs for destructive actions
- Toast notifications for actions
- Keyboard shortcuts support

### Data Import/Export
- CSV/Excel import for bulk data
- Export functionality for backup
- Error reporting for failed imports
- Template download for proper format

## Error Handling

The module includes comprehensive error handling:

- API error display with user-friendly messages
- Form validation errors
- Network connectivity issues
- Permission denied scenarios
- Data conflict resolution

## Security Considerations

- All API calls include authentication tokens
- Role-based access control
- CSRF protection
- XSS prevention
- SQL injection protection (backend)

## Performance Optimization

- Pagination for large datasets
- Lazy loading of subcategories
- Debounced search queries
- Caching of frequently accessed data
- Optimistic UI updates

## Integration Points

This module integrates with:

- **Product Module**: Categories are used for product classification
- **Directory Module**: Locations are used for business listings
- **Search Module**: Categories and locations power search filters
- **Analytics Module**: Provides data usage statistics

## Development

To extend this module:

1. Add new components in `components/` directory
2. Create corresponding API services in `services/`
3. Update types in `types/employee.ts`
4. Export new components in `index.ts`
5. Add routes in Next.js `app/` directory

## Testing

The module should be tested with:

- Unit tests for components and services
- Integration tests for API calls
- E2E tests for user workflows
- Performance tests for large datasets
- Security tests for authorization

## Deployment

Ensure the following environment variables are set:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

## Support

For technical support or questions about the Employee Module, contact the development team or refer to the main project documentation.
