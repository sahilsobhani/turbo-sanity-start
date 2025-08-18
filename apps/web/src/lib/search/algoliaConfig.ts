import { algoliasearch, SearchClient } from "algoliasearch";
import { createMemoryCache } from "@algolia/client-common";

// Environment vars
const appId: string | undefined = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const adminApiKey: string | undefined = process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_API_KEY; 
const searchApiKey: string | undefined = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;

if (!appId || !adminApiKey || !searchApiKey) {
  throw new Error(
    "Algolia env vars missing: NEXT_PUBLIC_ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY, or NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY"
  );
}

// what: Create admin client (server-only)
// why: Allows indexing, deleting, updating records
const adminClient: SearchClient = algoliasearch(appId, adminApiKey, {
  requestsCache: createMemoryCache(),
  responsesCache: createMemoryCache(),
  hostsCache: createMemoryCache(),
});

// what: Create search client (safe for browser)
// why: Only allows read/search operations
const searchClient: SearchClient = algoliasearch(appId, searchApiKey, {
  requestsCache: createMemoryCache(),
  responsesCache: createMemoryCache(),
  hostsCache: createMemoryCache(),
});

// what: expose a clearCache helper for admin client
// why: To clear cache after reindexing
export const clearAlgoliaCache: () => Promise<void> = async () => {
  await adminClient.clearCache();
};

// Exports
export { adminClient, searchClient };
