// lib/algolia.ts
// lib/algolia.ts
import { algoliasearch, SearchClient } from "algoliasearch";

// Load env vars safely
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const adminApiKey = process.env.ALGOLIA_ADMIN_API_KEY;

if (!appId || !adminApiKey) {
  throw new Error("Algolia env vars missing: NEXT_PUBLIC_ALGOLIA_APP_ID or ALGOLIA_ADMIN_API_KEY");
}

// Create client
const client: SearchClient = algoliasearch(appId, adminApiKey);

// Export for use in webhook handler
export { client };
