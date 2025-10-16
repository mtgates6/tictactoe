

import type { Schema } from '../amplify/data/resource';
import { Amplify } from 'aws-amplify';
import { generateClient, type Client } from 'aws-amplify/data';

let client: Client<Schema>;

if (import.meta.env.VITE_USE_LOCAL_AMPLIFY === 'true') {
  const initClient = async () => {
    const amplifyModule = await import('../amplify_outputs.json');
    const amplifyOutputs = amplifyModule.default;
    Amplify.configure(amplifyOutputs);
  };
  void initClient();
} else {
    // Configure Amplify minimally so generateClient can work in deployed environment
    Amplify.configure({
        API: {
            GraphQL: {
            endpoint: import.meta.env.VITE_GRAPHQL_ENDPOINT ?? '',
            defaultAuthMode: 'apiKey', 
            },
        },
    });
}

client = generateClient<Schema>();
// Then generate the client
export {client}; 