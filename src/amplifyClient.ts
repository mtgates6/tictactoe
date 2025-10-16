import type { Schema } from '../amplify/data/resource';
import { generateClient, type Client } from 'aws-amplify/data';
import { Amplify } from 'aws-amplify';

// Prefer amplify_outputs.json in all environments; fallback to env vars
try {
  const outputs = await import('../amplify_outputs.json');
  Amplify.configure(outputs.default);
} catch {
  if (!import.meta.env.VITE_GRAPHQL_ENDPOINT) {
    throw new Error('VITE_GRAPHQL_ENDPOINT must be set when amplify_outputs.json is not available');
  }
  Amplify.configure({
    API: {
      GraphQL: {
        endpoint: import.meta.env.VITE_GRAPHQL_ENDPOINT,
        region: import.meta.env.VITE_AWS_REGION || 'us-west-1',
        defaultAuthMode: 'apiKey',
        apiKey: import.meta.env.VITE_GRAPHQL_API_KEY
      }
    }
  });
}

const client: Client<Schema> = generateClient<Schema>();

export { client };
