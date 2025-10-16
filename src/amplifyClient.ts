
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

// Configure Amplify first
Amplify.configure(outputs);

// Then generate the client
export const client = generateClient<Schema>();