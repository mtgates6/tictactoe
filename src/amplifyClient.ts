import type { Schema } from '../amplify/data/resource';
import { generateClient, type Client } from 'aws-amplify/data';
import { Amplify } from 'aws-amplify';

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV || import.meta.env.VITE_USE_LOCAL_AMPLIFY === 'true';

// Configure Amplify based on environment
if (isDevelopment) {
  // Development: Try to use local amplify_outputs.json, fallback to env vars
  try {
    // @ts-ignore - This file may not exist in production builds
    const amplifyOutputs = require('../amplify_outputs.json');
    Amplify.configure(amplifyOutputs);
  } catch (error) {
    console.warn('Could not load amplify_outputs.json, using environment variables');
    // Fallback to environment variables
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
} else {
  // Production: Use environment variables
  if (!import.meta.env.VITE_GRAPHQL_ENDPOINT) {
    throw new Error('VITE_GRAPHQL_ENDPOINT must be set for production environment');
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
