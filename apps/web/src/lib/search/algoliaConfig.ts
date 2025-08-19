import { algoliasearch, SearchClient } from "algoliasearch";
import { createMemoryCache } from "@algolia/client-common";

// --- Public (safe for browser) ---
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
const searchApiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!;

export const searchClient: SearchClient = algoliasearch(appId, searchApiKey, {
  requestsCache: createMemoryCache(),
  responsesCache: createMemoryCache(),
  hostsCache: createMemoryCache(),
});
