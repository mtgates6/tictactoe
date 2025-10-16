

//import { a } from '@aws-amplify/backend';
import type { Schema } from '../amplify/data/resource';
//import { Amplify } from 'aws-amplify';
// import { generateClient, Client} from '@aws-amplify/datastore';
import { generateClient } from 'aws-amplify/data';

// Then generate the client
export const client = generateClient<Schema>();