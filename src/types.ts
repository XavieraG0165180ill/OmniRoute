/**
 * Core type definitions for OmniRoute.
 * Defines the contracts for route handlers, middleware, and configuration.
 */

/** HTTP methods supported by OmniRoute */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

/** Parsed URL parameters extracted from route patterns (e.g., /users/:id) */
export type RouteParams = Record<string, string>;

/** Query string parameters parsed from the URL */
export type QueryParams = Record<string, string | string[]>;

/** Represents an incoming HTTP request with additional routing context */
export interface OmniRequest {
  /** The original Request object */
  raw: Request;
  /** HTTP method of the request */
  method: HttpMethod;
  /** Full URL of the request */
  url: URL;
  /** Route parameters extracted from the URL pattern */
  params: RouteParams;
  /** Query string parameters */
  query: QueryParams;
  /** Request headers */
  headers: Headers;
  /** Parse the request body as JSON */
  json: <T = unknown>() => Promise<T>;
  /** Parse the request body as text */
  text: () => Promise<string>;
}

/** Represents an outgoing HTTP response helper */
export interface OmniResponse {
  /** Send a JSON response */
  json: (data: unknown, init?: ResponseInit) => Response;
  /** Send a plain text response */
  text: (body: string, init?: ResponseInit) => Response;
  /** Send an empty response with a status code */
  status: (code: number, body?: string) => Response;
  /** Redirect to another URL */
  redirect: (url: string, status?: 301 | 302 | 307 | 308) => Response;
}

/** Route handler function signature */
export type RouteHandler = (
  req: OmniRequest,
  res: OmniResponse
) => Response | Promise<Response>;

/** Middleware function signature — must call next() to continue the chain */
export type Middleware = (
  req: OmniRequest,
  res: OmniResponse,
  next: () => Promise<Response>
) => Response | Promise<Response>;

/** A registered route definition */
export interface RouteDefinition {
  method: HttpMethod;
  pattern: string;
  handler: RouteHandler;
  middleware: Middleware[];
}

/** Configuration options for createOmniRoute */
export interface OmniRouteConfig {
  /** Base path prefix applied to all routes (default: '') */
  basePath?: string;
  /** Global middleware applied to every request */
  middleware?: Middleware[];
  /** Custom 404 handler */
  notFound?: RouteHandler;
  /** Custom error handler */
  onError?: (error: unknown, req: OmniRequest, res: OmniResponse) => Response | Promise<Response>;
  /**
   * Whether to treat trailing slashes as equivalent to their non-trailing counterparts.
   * e.g. /users/ matches /users (default: true)
   */
  trailingSlash?: boolean;
}

/** The public interface returned by createOmniRoute */
export interface OmniRouter {
  get: (path: string, ...args: [...Middleware[], RouteHandler]) => OmniRouter;
  post: (path: string, ...args: [...Middleware[], RouteHandler]) => OmniRouter;
  put: (path: string, ...args: [...Middleware[], RouteHandler]) => OmniRouter;
  patch: (path: string, ...args: [...Middleware[], RouteHandler]) => OmniRouter;
  delete: (path: string, ...args: [...Middleware[], RouteHan