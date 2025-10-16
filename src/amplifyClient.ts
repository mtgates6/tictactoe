

import type { Schema } from '../amplify/data/resource';
import { Amplify } from 'aws-amplify';
import { generateClient, type Client } from 'aws-amplify/data';

let client: Client<Schema>;

if (import.meta.env.VITE_USE_LOCAL_AMPLIFY === 'true') {
   (async () => {
    const amplifyModule = await import('../amplify_outputs.json');
    const amplifyOutputs = amplifyModule.default; // unwrap default
    Amplify.configure(amplifyOutputs);
  })();
} else {
    if (!import.meta.env.VITE_GRAPHQL_ENDPOINT) {
    throw new Error('VITE_GRAPHQL_ENDPOINT must be set for deployed environment');
  }
}

client = generateClient<Schema>();
// Then generate the client
export {client}; 