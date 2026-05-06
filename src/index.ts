/**
 * OmniRoute - A flexible, multi-provider AI routing library
 * Automatically routes requests to the best available AI provider
 * based on cost, latency, availability, and capability requirements.
 */

import { Router } from './router';
import { ProviderRegistry } from './registry';
import type { OmniRouteConfig, RouteRequest, RouteResponse } from './types';

export { Router } from './router';
export { ProviderRegistry } from './registry';
export * from './types';

/**
 * Creates a new OmniRoute instance with the given configuration.
 *
 * @param config - Configuration options for the router
 * @returns A configured Router instance ready to handle requests
 *
 * @example
 * ```ts
 * const router = createOmniRoute({
 *   providers: [
 *     { name: 'openai', apiKey: process.env.OPENAI_API_KEY },
 *     { name: 'anthropic', apiKey: process.env.ANTHROPIC_API_KEY },
 *   ],
 *   strategy: 'cost-optimized',
 * });
 *
 * const response = await router.route({
 *   model: 'gpt-4',
 *   messages: [{ role: 'user', content: 'Hello!' }],
 * });
 * ```
 */
export function createOmniRoute(config: OmniRouteConfig): Router {
  const registry = new ProviderRegistry(config.providers ?? []);
  return new Router(registry, config);
}

/**
 * Default export for convenience — a factory function
 * that mirrors the named `createOmniRoute` export.
 */
export default createOmniRoute;
