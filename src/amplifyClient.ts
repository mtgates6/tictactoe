import type { Schema } from '../amplify/data/resource';
import { generateClient, type Client } from 'aws-amplify/data';
import { Amplify } from 'aws-amplify';

// Prefer amplify_outputs.json when present; fallback to env vars
const outputsMatch = import.meta.glob('../amplify_outputs.json', { eager: true });
const outputsModule = outputsMatch['../amplify_outputs.json'] as any | undefined;
const resolvedOutputs = outputsModule?.default ?? outputsModule;

if (resolvedOutputs) {
  Amplify.configure(resolvedOutputs);
  // Basic diagnostics to confirm configuration in the deployed app
  try {
    // @ts-ignore safe optional log
    const endpoint = resolvedOutputs?.aws_appsync_graphqlEndpoint || resolvedOutputs?.API?.GraphQL?.endpoint;
    console.log('[Amplify] configured from amplify_outputs.json', { endpoint });
  } catch {}
} else {
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
  console.log('[Amplify] configured from environment variables', {
    endpoint: import.meta.env.VITE_GRAPHQL_ENDPOINT,
    region: import.meta.env.VITE_AWS_REGION
  });
}

const client: Client<Schema> = generateClient<Schema>();

export { client };
