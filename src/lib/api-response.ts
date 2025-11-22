import { NextResponse } from 'next/server';

/**
 * Standard API Response Utilities
 *
 * This module provides standardized response formats for all API endpoints.
 * All responses follow a consistent structure with success/error indicators.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiCollectionResponse<T = any> {
  success: true;
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    count: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: string;
  hint?: string;
  errorCode?: string;
}

export interface ValidationError {
  [field: string]: string;
}

export interface ApiValidationErrorResponse {
  success: false;
  error: string;
  validation: ValidationError;
}

export type ApiResponse<T = any> =
  | ApiSuccessResponse<T>
  | ApiCollectionResponse<T>
  | ApiErrorResponse
  | ApiValidationErrorResponse;

// ============================================================================
// PAGINATION HELPER
// ============================================================================

export interface PaginationParams {
  limit?: number;
  offset?: number;
  defaultLimit?: number;
  maxLimit?: number;
}

export function getPaginationParams(
  searchParams: URLSearchParams,
  options: PaginationParams = {}
): { limit: number; offset: number } {
  const {
    defaultLimit = 50,
    maxLimit = 100,
  } = options;

  const limit = Math.min(
    parseInt(searchParams.get('limit') || String(defaultLimit)),
    maxLimit
  );
  const offset = parseInt(searchParams.get('offset') || '0');

  return { limit, offset };
}

// ============================================================================
// SUCCESS RESPONSE HELPERS
// ============================================================================

/**
 * Create a standardized success response for a single resource
 *
 * @param data - The resource data
 * @param message - Optional success message
 * @param status - HTTP status code (default: 200)
 *
 * @example
 * return apiSuccess({ id: 1, name: "Villa Bali" }, "Property created", 201);
 * // Returns: { success: true, data: {...}, message: "..." }
 */
export function apiSuccess<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
  };

  if (message) {
    response.message = message;
  }

  return NextResponse.json(response, { status });
}

/**
 * Create a standardized success response for a collection with pagination
 *
 * @param data - Array of items
 * @param total - Total count of items (for pagination)
 * @param limit - Items per page
 * @param offset - Current offset
 * @param status - HTTP status code (default: 200)
 *
 * @example
 * return apiCollection(properties, 100, 20, 0);
 * // Returns: { success: true, data: [...], pagination: {...} }
 */
export function apiCollection<T>(
  data: T[],
  total: number,
  limit: number,
  offset: number,
  status: number = 200
): NextResponse<ApiCollectionResponse<T>> {
  const response: ApiCollectionResponse<T> = {
    success: true,
    data,
    pagination: {
      total,
      limit,
      offset,
      count: data.length,
    },
  };

  return NextResponse.json(response, { status });
}

/**
 * Create a standardized success response with only a message (no data)
 * Useful for DELETE operations or actions that don't return data
 *
 * @param message - Success message
 * @param status - HTTP status code (default: 200)
 *
 * @example
 * return apiMessage("Property deleted successfully");
 * // Returns: { success: true, data: null, message: "..." }
 */
export function apiMessage(
  message: string,
  status: number = 200
): NextResponse<ApiSuccessResponse<null>> {
  return NextResponse.json({
    success: true,
    data: null,
    message,
  }, { status });
}

// ============================================================================
// ERROR RESPONSE HELPERS
// ============================================================================

/**
 * Create a standardized error response
 *
 * @param error - User-friendly error message
 * @param status - HTTP status code
 * @param details - Technical details (optional, for development)
 * @param hint - Helpful hint for fixing the issue (optional)
 * @param errorCode - Error code (optional)
 *
 * @example
 * return apiError("Property not found", 404);
 * return apiError("Database error", 500, error.message, "Check RLS policies", "42501");
 */
export function apiError(
  error: string,
  status: number = 500,
  details?: string,
  hint?: string,
  errorCode?: string
): NextResponse<ApiErrorResponse> {
  const response: ApiErrorResponse = {
    success: false,
    error,
  };

  // Only include details in development mode for security
  if (details && process.env.NODE_ENV === 'development') {
    response.details = details;
  }

  if (hint) {
    response.hint = hint;
  }

  if (errorCode) {
    response.errorCode = errorCode;
  }

  return NextResponse.json(response, { status });
}

/**
 * Create a standardized validation error response
 *
 * @param validation - Object with field names as keys and error messages as values
 * @param status - HTTP status code (default: 400)
 *
 * @example
 * return apiValidationError({
 *   email: "Invalid email format",
 *   password: "Password must be at least 8 characters"
 * });
 */
export function apiValidationError(
  validation: ValidationError,
  status: number = 400
): NextResponse<ApiValidationErrorResponse> {
  return NextResponse.json({
    success: false,
    error: 'Validation failed',
    validation,
  }, { status });
}

// ============================================================================
// COMMON ERROR RESPONSES
// ============================================================================

/**
 * Standard 401 Unauthorized response
 */
export function apiUnauthorized(
  message: string = 'Unauthorized'
): NextResponse<ApiErrorResponse> {
  return apiError(message, 401);
}

/**
 * Standard 403 Forbidden response
 */
export function apiForbidden(
  message: string = 'Access forbidden'
): NextResponse<ApiErrorResponse> {
  return apiError(message, 403);
}

/**
 * Standard 404 Not Found response
 */
export function apiNotFound(
  resource: string = 'Resource'
): NextResponse<ApiErrorResponse> {
  return apiError(`${resource} not found`, 404);
}

/**
 * Standard 409 Conflict response
 */
export function apiConflict(
  message: string = 'Resource already exists'
): NextResponse<ApiErrorResponse> {
  return apiError(message, 409);
}

/**
 * Standard 429 Rate Limit response
 */
export function apiRateLimited(
  message: string = 'Too many requests. Please try again later.'
): NextResponse<ApiErrorResponse> {
  return apiError(message, 429);
}

/**
 * Standard 503 Service Unavailable response
 */
export function apiServiceUnavailable(
  message: string = 'Service temporarily unavailable'
): NextResponse<ApiErrorResponse> {
  return apiError(message, 503);
}

// ============================================================================
// DATABASE ERROR HANDLER
// ============================================================================

/**
 * Handle database errors with specific error codes
 * Provides user-friendly messages for common database errors
 *
 * @param error - Database error object
 * @param context - Context description (e.g., "creating property")
 */
export function handleDatabaseError(
  error: any,
  context: string = 'processing request'
): NextResponse<ApiErrorResponse> {
  // PostgreSQL Error Codes
  const errorCode = error.code || error.errorCode;

  // Row Level Security violation
  if (errorCode === '42501' || error.message?.includes('row-level security')) {
    return apiError(
      `Database permission error while ${context}`,
      500,
      error.message,
      'RLS policies might be blocking this operation. Check Supabase dashboard.',
      errorCode
    );
  }

  // Unique constraint violation
  if (errorCode === '23505') {
    return apiConflict(
      `Resource already exists while ${context}`
    );
  }

  // Foreign key constraint violation
  if (errorCode === '23503') {
    return apiError(
      `Referenced resource not found while ${context}`,
      400,
      error.message,
      'The referenced resource may have been deleted.',
      errorCode
    );
  }

  // Not null constraint violation
  if (errorCode === '23502') {
    return apiError(
      `Missing required field while ${context}`,
      400,
      error.message,
      'A required database field is missing.',
      errorCode
    );
  }

  // Generic database error
  return apiError(
    `Database error while ${context}`,
    500,
    error.message,
    'Check database logs for more details.',
    errorCode
  );
}

// ============================================================================
// SUPABASE ERROR HANDLER
// ============================================================================

/**
 * Handle Supabase-specific errors
 *
 * @param error - Supabase error object
 * @param context - Context description
 */
export function handleSupabaseError(
  error: any,
  context: string = 'processing request'
): NextResponse<ApiErrorResponse> {
  // Supabase not configured
  if (error.message?.includes('SUPABASE_URL') ||
      error.message?.includes('SUPABASE_ANON_KEY')) {
    return apiServiceUnavailable(
      'Database service is not configured. Please contact support.'
    );
  }

  // Network/connection errors
  if (error.message?.includes('fetch') ||
      error.message?.includes('network') ||
      error.message?.includes('ECONNREFUSED')) {
    return apiError(
      'Database connection failed',
      503,
      error.message,
      'The database service may be temporarily unavailable.'
    );
  }

  // Use database error handler for SQL errors
  if (error.code) {
    return handleDatabaseError(error, context);
  }

  // Generic Supabase error
  return apiError(
    `Error while ${context}`,
    500,
    error.message
  );
}

// ============================================================================
// REQUEST BODY VALIDATOR
// ============================================================================

/**
 * Validate required fields in request body
 *
 * @param body - Request body object
 * @param requiredFields - Array of required field names
 * @returns Object with isValid boolean and errors object
 *
 * @example
 * const validation = validateRequiredFields(body, ['email', 'password']);
 * if (!validation.isValid) {
 *   return apiValidationError(validation.errors);
 * }
 */
export function validateRequiredFields(
  body: Record<string, any>,
  requiredFields: string[]
): { isValid: boolean; errors: ValidationError } {
  const errors: ValidationError = {};

  for (const field of requiredFields) {
    if (!body[field] || (typeof body[field] === 'string' && !body[field].trim())) {
      errors[field] = `${field} is required`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Check if response is a success response
 */
export function isSuccessResponse(response: ApiResponse): response is ApiSuccessResponse {
  return response.success === true;
}

/**
 * Check if response is an error response
 */
export function isErrorResponse(response: ApiResponse): response is ApiErrorResponse {
  return response.success === false;
}

/**
 * Check if response is a collection response
 */
export function isCollectionResponse(response: ApiResponse): response is ApiCollectionResponse {
  return response.success === true && 'pagination' in response;
}
