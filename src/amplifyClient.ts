

import type { Schema } from '../amplify/data/resource';
import { Amplify } from 'aws-amplify';
// import { generateClient, Client} from '@aws-amplify/datastore';
import { generateClient } from 'aws-amplify/data';

Amplify.configure({
    // Add your Amplify configuration here
    aws_project_region: 'us-west-1',
});

// Then generate the client
export const client = generateClient<Schema>();