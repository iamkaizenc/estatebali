# API Response Standards

**Estate Bali API Response Format Specification v1.0**

This document defines the standardized response format for all API endpoints in the Estate Bali application.

## Table of Contents

1. [Overview](#overview)
2. [Response Formats](#response-formats)
3. [Status Codes](#status-codes)
4. [Utility Functions](#utility-functions)
5. [Implementation Guide](#implementation-guide)
6. [Migration from Legacy Formats](#migration-from-legacy-formats)
7. [Examples](#examples)
8. [Testing](#testing)

---

## Overview

All API endpoints follow a consistent response structure to ensure:
- **Client Integration Consistency**: Predictable response shapes
- **Type Safety**: Full TypeScript support
- **Error Handling**: Standardized error messages with validation details
- **Pagination Support**: Consistent pagination metadata
- **Developer Experience**: Clear success/error indicators

### Core Principles

1. **Every response includes a `success` field** (true/false)
2. **Success responses wrap data in a `data` field**
3. **Collections include `pagination` metadata**
4. **Errors provide user-friendly messages + optional technical details**
5. **Validation errors map fields to specific error messages**

---

## Response Formats

### 1. Success Response (Single Resource)

Used for GET (single), POST, PUT, PATCH operations that return a single resource.

```typescript
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;  // Optional success message
}
```

**Example:**
```json
{
  "success": true,
  "data": {
    "id": "prop_123",
    "title": "Luxury Villa in Ubud",
    "price": 1500000,
    "bedrooms": 4
  },
  "message": "Property created successfully"
}
```

**HTTP Status:** Usually `200 OK` or `201 Created`

---

### 2. Success Response (Collection)

Used for GET operations that return multiple items with pagination.

```typescript
interface ApiCollectionResponse<T> {
  success: true;
  data: T[];
  pagination: {
    total: number;    // Total items in database
    limit: number;    // Items per page
    offset: number;   // Current offset
    count: number;    // Items in this response
  };
}
```

**Example:**
```json
{
  "success": true,
  "data": [
    { "id": "prop_1", "title": "Villa A" },
    { "id": "prop_2", "title": "Villa B" }
  ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "count": 20
  }
}
```

**HTTP Status:** `200 OK`

**Query Parameters:**
- `limit` (optional): Items per page (default: 50, max: 100)
- `offset` (optional): Pagination offset (default: 0)

---

### 3. Message Response (No Data)

Used for DELETE operations or actions that don't return data.

```typescript
interface ApiMessageResponse {
  success: true;
  data: null;
  message: string;
}
```

**Example:**
```json
{
  "success": true,
  "data": null,
  "message": "Property deleted successfully"
}
```

**HTTP Status:** `200 OK` or `204 No Content`

---

### 4. Error Response

Used for all error scenarios.

```typescript
interface ApiErrorResponse {
  success: false;
  error: string;        // User-friendly error message
  details?: string;     // Technical details (development only)
  hint?: string;        // Helpful suggestion for fixing
  errorCode?: string;   // Error code or database code
}
```

**Example:**
```json
{
  "success": false,
  "error": "Property not found",
  "details": "No property with ID 'prop_999' exists",
  "hint": "Check if the property was deleted",
  "errorCode": "NOT_FOUND"
}
```

**HTTP Status:** 400, 401, 403, 404, 409, 429, 500, 503

**Note:** `details` field only included in development mode for security.

---

### 5. Validation Error Response

Used for validation failures (invalid input, missing required fields).

```typescript
interface ApiValidationErrorResponse {
  success: false;
  error: "Validation failed";
  validation: {
    [field: string]: string;  // Field name -> error message
  };
}
```

**Example:**
```json
{
  "success": false,
  "error": "Validation failed",
  "validation": {
    "email": "Invalid email address format",
    "password": "Password must be at least 8 characters",
    "bedrooms": "Must be a positive number"
  }
}
```

**HTTP Status:** `400 Bad Request`

---

## Status Codes

### Success Codes

| Code | Usage | Utility Function |
|------|-------|-----------------|
| **200 OK** | Standard success | `apiSuccess()`, `apiCollection()`, `apiMessage()` |
| **201 Created** | Resource created | `apiSuccess(data, message, 201)` |
| **204 No Content** | Success, no response body | N/A (direct NextResponse) |

### Error Codes

| Code | Meaning | Utility Function | Usage |
|------|---------|-----------------|-------|
| **400 Bad Request** | Invalid input, validation error | `apiValidationError()`, `apiError(msg, 400)` | Missing fields, invalid data format |
| **401 Unauthorized** | Authentication required or failed | `apiUnauthorized()` | Missing/invalid auth token |
| **403 Forbidden** | Authenticated but insufficient permissions | `apiForbidden()` | User not admin, wrong role |
| **404 Not Found** | Resource doesn't exist | `apiNotFound("Resource")` | Property, user, booking not found |
| **409 Conflict** | Resource already exists | `apiConflict()` | Duplicate email, existing favorite |
| **429 Too Many Requests** | Rate limit exceeded | `apiRateLimited()` | Too many login attempts |
| **500 Internal Server Error** | Server/database error | `apiError()` | Unexpected errors, crashes |
| **503 Service Unavailable** | Service down or not configured | `apiServiceUnavailable()` | Database offline, Supabase not configured |

---

## Utility Functions

All utility functions are in `src/lib/api-response.ts`.

### Success Responses

#### `apiSuccess<T>(data, message?, status?)`

Create a success response with a single resource.

```typescript
import { apiSuccess } from '@/lib/api-response';

// Basic usage
return apiSuccess(property);

// With success message
return apiSuccess(user, 'User created successfully', 201);

// Response: { success: true, data: {...}, message: "..." }
```

**Parameters:**
- `data: T` - The resource data
- `message?: string` - Optional success message
- `status?: number` - HTTP status (default: 200)

---

#### `apiCollection<T>(data, total, limit, offset, status?)`

Create a collection response with pagination.

```typescript
import { apiCollection } from '@/lib/api-response';

const properties = [...];  // Array of items
const total = 150;         // Total in database

return apiCollection(properties, total, 20, 0);

// Response: { success: true, data: [...], pagination: {...} }
```

**Parameters:**
- `data: T[]` - Array of items
- `total: number` - Total count in database
- `limit: number` - Items per page
- `offset: number` - Current offset
- `status?: number` - HTTP status (default: 200)

---

#### `apiMessage(message, status?)`

Create a success response with only a message (no data).

```typescript
import { apiMessage } from '@/lib/api-response';

return apiMessage('Property deleted successfully');

// Response: { success: true, data: null, message: "..." }
```

**Use Cases:** DELETE operations, actions without return data

---

### Error Responses

#### `apiError(error, status?, details?, hint?, errorCode?)`

Create a standard error response.

```typescript
import { apiError } from '@/lib/api-response';

// Basic error
return apiError('Property not found', 404);

// With details and hint
return apiError(
  'Database error while creating property',
  500,
  error.message,  // Only shown in development
  'Check RLS policies in Supabase',
  '42501'
);

// Response: { success: false, error: "...", details?: "...", ... }
```

**Parameters:**
- `error: string` - User-friendly error message (required)
- `status?: number` - HTTP status code (default: 500)
- `details?: string` - Technical details (dev mode only)
- `hint?: string` - Helpful suggestion
- `errorCode?: string` - Error/database code

---

#### `apiValidationError(validation, status?)`

Create a validation error response with field-level errors.

```typescript
import { apiValidationError } from '@/lib/api-response';

const errors = {
  email: 'Invalid email format',
  password: 'Password must be at least 8 characters'
};

return apiValidationError(errors);

// Response: { success: false, error: "Validation failed", validation: {...} }
```

---

#### Common Error Responses

Pre-configured error responses for common HTTP status codes:

```typescript
import {
  apiUnauthorized,
  apiForbidden,
  apiNotFound,
  apiConflict,
  apiRateLimited,
  apiServiceUnavailable
} from '@/lib/api-response';

// 401 Unauthorized
return apiUnauthorized();
return apiUnauthorized('Invalid authentication token');

// 403 Forbidden
return apiForbidden();
return apiForbidden('Admin access required');

// 404 Not Found
return apiNotFound('Property');
// Response: { success: false, error: "Property not found" }

// 409 Conflict
return apiConflict();
return apiConflict('Email already registered');

// 429 Rate Limited
return apiRateLimited();
return apiRateLimited('Too many login attempts. Try again in 15 minutes.');

// 503 Service Unavailable
return apiServiceUnavailable();
return apiServiceUnavailable('Database is temporarily offline');
```

---

### Helper Functions

#### `getPaginationParams(searchParams, options?)`

Extract and validate pagination parameters from URL search params.

```typescript
import { getPaginationParams } from '@/lib/api-response';

const searchParams = request.nextUrl.searchParams;
const { limit, offset } = getPaginationParams(searchParams);

// With custom options
const { limit, offset } = getPaginationParams(searchParams, {
  defaultLimit: 20,
  maxLimit: 100
});
```

**Options:**
- `defaultLimit?: number` - Default items per page (default: 50)
- `maxLimit?: number` - Maximum items per page (default: 100)

**Returns:** `{ limit: number, offset: number }`

---

#### `validateRequiredFields(body, requiredFields)`

Validate required fields in request body.

```typescript
import { validateRequiredFields, apiValidationError } from '@/lib/api-response';

const body = await request.json();
const validation = validateRequiredFields(body, ['email', 'password']);

if (!validation.isValid) {
  return apiValidationError(validation.errors);
}

// Errors format: { email: "email is required", password: "password is required" }
```

**Parameters:**
- `body: Record<string, any>` - Request body
- `requiredFields: string[]` - Array of required field names

**Returns:** `{ isValid: boolean, errors: ValidationError }`

---

#### `handleDatabaseError(error, context)`

Convert database errors to user-friendly responses.

```typescript
import { handleDatabaseError } from '@/lib/api-response';

try {
  // Database operation
  const { data, error } = await supabase.from('properties').insert([...]);

  if (error) {
    return handleDatabaseError(error, 'creating property');
  }
} catch (error) {
  return handleDatabaseError(error, 'creating property');
}
```

**Handles PostgreSQL Error Codes:**
- `42501` - Row Level Security violation
- `23505` - Unique constraint violation (returns 409 Conflict)
- `23503` - Foreign key constraint violation
- `23502` - Not null constraint violation

---

#### `handleSupabaseError(error, context)`

Handle Supabase-specific errors (connection, configuration, etc.).

```typescript
import { handleSupabaseError } from '@/lib/api-response';

try {
  const { data, error } = await supabase.from('properties').select();

  if (error) {
    return handleSupabaseError(error, 'fetching properties');
  }
} catch (error) {
  return handleSupabaseError(error, 'fetching properties');
}
```

**Detects:**
- Missing Supabase configuration (SUPABASE_URL, SUPABASE_ANON_KEY)
- Network/connection errors
- Falls back to `handleDatabaseError()` for SQL errors

---

## Implementation Guide

### Complete Endpoint Example

Here's a complete example showing best practices:

```typescript
import { NextRequest } from 'next/server';
import {
  apiSuccess,
  apiCollection,
  apiError,
  apiUnauthorized,
  apiValidationError,
  getPaginationParams,
  validateRequiredFields,
  handleSupabaseError,
} from '@/lib/api-response';
import { verifyAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase';

// GET /api/properties - List properties with pagination
export async function GET(request: NextRequest) {
  try {
    // Optional authentication (public endpoint)
    const auth = verifyAuth(request);

    // Get pagination params
    const searchParams = request.nextUrl.searchParams;
    const { limit, offset } = getPaginationParams(searchParams);

    // Fetch from database
    const supabase = createClient();
    const { data, error, count } = await supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .eq('status', 'available')
      .range(offset, offset + limit - 1);

    if (error) {
      return handleSupabaseError(error, 'fetching properties');
    }

    return apiCollection(data || [], count || 0, limit, offset);
  } catch (error) {
    console.error('Properties fetch error:', error);
    return apiError('Failed to fetch properties');
  }
}

// POST /api/properties - Create new property
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const auth = verifyAuth(request);
    if (!auth.success) {
      return apiUnauthorized(auth.error);
    }

    // Parse request body
    const body = await request.json();
    const { title, description, price, bedrooms, bathrooms } = body;

    // Validate required fields
    const validation = validateRequiredFields(body, [
      'title',
      'description',
      'price',
      'bedrooms',
      'bathrooms'
    ]);

    if (!validation.isValid) {
      return apiValidationError(validation.errors);
    }

    // Custom validation
    if (price <= 0) {
      return apiValidationError({ price: 'Price must be positive' });
    }

    // Insert into database
    const supabase = createClient();
    const { data, error } = await supabase
      .from('properties')
      .insert([{
        title,
        description,
        price,
        bedrooms,
        bathrooms,
        user_id: auth.userId,
      }])
      .select()
      .single();

    if (error) {
      return handleSupabaseError(error, 'creating property');
    }

    return apiSuccess(data, 'Property created successfully', 201);
  } catch (error) {
    console.error('Property creation error:', error);
    return apiError('Failed to create property');
  }
}
```

---

## Migration from Legacy Formats

### Before Standardization

```typescript
// ❌ Old Format (Inconsistent)
return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
return NextResponse.json({ success: true, notifications: [] });
return NextResponse.json({ success: true, lead: {...} });
```

### After Standardization

```typescript
// ✅ New Format (Consistent)
return apiUnauthorized();
return apiCollection(notifications, total, limit, offset);
return apiSuccess(lead, 'Lead created successfully', 201);
```

### Migration Checklist

- [ ] Replace manual JWT parsing with `verifyAuth()`
- [ ] Use `apiSuccess()` instead of direct `NextResponse.json()`
- [ ] Wrap collections with `apiCollection()` + pagination
- [ ] Use `apiError()` family for all errors
- [ ] Add `success` field to all responses
- [ ] Standardize data field names (use `data` not `leads`, `notifications`, etc.)
- [ ] Use `validateRequiredFields()` for input validation
- [ ] Replace manual validation errors with `apiValidationError()`
- [ ] Add proper error logging with `console.error()`
- [ ] Use `handleSupabaseError()` for database operations

---

## Examples

### Example 1: Authentication Check

```typescript
export async function DELETE(request: NextRequest) {
  const auth = verifyAuth(request);
  if (!auth.success) {
    return apiUnauthorized(auth.error);
  }

  if (auth.role !== 'admin') {
    return apiForbidden('Admin access required');
  }

  // ... delete logic
  return apiMessage('Resource deleted successfully');
}
```

### Example 2: Validation

```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  // Required fields
  const validation = validateRequiredFields(body, ['email', 'password']);
  if (!validation.isValid) {
    return apiValidationError(validation.errors);
  }

  // Custom validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return apiValidationError({ email: 'Invalid email format' });
  }

  if (password.length < 8) {
    return apiValidationError({ password: 'Password must be at least 8 characters' });
  }

  // ... proceed
}
```

### Example 3: Database Error Handling

```typescript
export async function POST(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('properties')
      .insert([propertyData]);

    if (error) {
      return handleSupabaseError(error, 'creating property');
    }

    return apiSuccess(data, 'Property created', 201);
  } catch (error) {
    console.error('Unexpected error:', error);
    return apiError('Failed to create property');
  }
}
```

### Example 4: Pagination

```typescript
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { limit, offset } = getPaginationParams(searchParams, {
    defaultLimit: 20,
    maxLimit: 100
  });

  const { data, count } = await supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .range(offset, offset + limit - 1);

  return apiCollection(data, count, limit, offset);
}
```

---

## Testing

### Testing Response Format

```typescript
describe('API Response Format', () => {
  it('should return success response with data', async () => {
    const response = await fetch('/api/properties/123');
    const json = await response.json();

    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
    expect(json.data.id).toBe('123');
  });

  it('should return collection with pagination', async () => {
    const response = await fetch('/api/properties?limit=20&offset=0');
    const json = await response.json();

    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.pagination).toEqual({
      total: expect.any(Number),
      limit: 20,
      offset: 0,
      count: expect.any(Number)
    });
  });

  it('should return validation error for missing fields', async () => {
    const response = await fetch('/api/properties', {
      method: 'POST',
      body: JSON.stringify({})
    });
    const json = await response.json();

    expect(json.success).toBe(false);
    expect(json.error).toBe('Validation failed');
    expect(json.validation).toBeDefined();
    expect(json.validation.title).toBeDefined();
  });

  it('should return 401 for unauthorized requests', async () => {
    const response = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test' })
    });

    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error).toBeDefined();
  });
});
```

---

## Best Practices

### ✅ DO

1. **Always include `success` field**
   ```typescript
   ✅ return apiSuccess(data);
   ❌ return NextResponse.json({ data });
   ```

2. **Use standard error utilities**
   ```typescript
   ✅ return apiUnauthorized();
   ❌ return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   ```

3. **Wrap collections with pagination**
   ```typescript
   ✅ return apiCollection(items, total, limit, offset);
   ❌ return NextResponse.json({ items });
   ```

4. **Validate inputs properly**
   ```typescript
   ✅ const validation = validateRequiredFields(body, ['email']);
       if (!validation.isValid) return apiValidationError(validation.errors);
   ❌ if (!body.email) return NextResponse.json({ error: 'Missing email' });
   ```

5. **Handle database errors**
   ```typescript
   ✅ if (error) return handleSupabaseError(error, 'creating property');
   ❌ if (error) return NextResponse.json({ error: error.message }, { status: 500 });
   ```

### ❌ DON'T

1. **Don't return raw NextResponse.json() for standard responses**
2. **Don't use different property names for data** (`leads`, `notifications` → use `data`)
3. **Don't omit the `success` field**
4. **Don't manually parse JWT tokens** (use `verifyAuth()`)
5. **Don't expose sensitive error details in production**

---

## Summary

All Estate Bali API endpoints follow this standard:

- **Every response has `success: boolean`**
- **Success responses wrap data in `data` field**
- **Collections include `pagination` metadata**
- **Errors use `apiError()` utilities with proper status codes**
- **Validation errors map to specific fields**
- **Database errors are handled with context-aware messages**
- **Authentication uses centralized `verifyAuth()`**
- **All responses are TypeScript typed**

**Migration Status:** ✅ 7 endpoints standardized, 20+ already compliant

For questions or issues, see `src/lib/api-response.ts` source code.
