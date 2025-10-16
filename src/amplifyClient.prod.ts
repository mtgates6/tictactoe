import type { Schema } from '../amplify/data/resource';
import { generateClient, type Client } from 'aws-amplify/data';

if (!import.meta.env.VITE_GRAPHQL_ENDPOINT) {
  throw new Error('VITE_GRAPHQL_ENDPOINT must be set for deployed environment');
}

const client: Client<Schema> = generateClient<Schema>();

export { client };
