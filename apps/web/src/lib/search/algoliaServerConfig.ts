import { algoliasearch, SearchClient } from "algoliasearch";
import { createMemoryCache } from "@algolia/client-common";

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;

// --- Server-side helper ---
export function adminClient(): SearchClient {
  const adminApiKey = process.env.ALGOLIA_ADMIN_API_KEY;
  if (!adminApiKey) {
    throw new Error("Missing ALGOLIA_ADMIN_API_KEY");
  }

  return algoliasearch(appId, adminApiKey, {
    requestsCache: createMemoryCache(),
    responsesCache: createMemoryCache(),
    hostsCache: createMemoryCache(),
  });
}
