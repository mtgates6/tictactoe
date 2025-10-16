import type { Schema } from '../amplify/data/resource';
import { generateClient, type Client } from 'aws-amplify/data';
import amplifyOutputs from '../amplify_outputs.json'; // static import safe in dev
import { Amplify } from 'aws-amplify';


Amplify.configure(amplifyOutputs)
const client: Client<Schema> = generateClient<Schema>();

export { client };
