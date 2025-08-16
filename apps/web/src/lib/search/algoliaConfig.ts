// lib/algolia.ts
import {algoliasearch , SearchClient} from "algoliasearch";

// Load env vars
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "";
const adminApiKey = process.env.ALGOLIA_ADMIN_API_KEY || "";


// Create client
const client: SearchClient = algoliasearch(appId, adminApiKey);


// Export for use in webhook handler
export { client };
