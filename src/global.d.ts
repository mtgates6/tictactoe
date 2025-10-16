declare module '@amplifyClient' {
  import type { Client } from 'aws-amplify/data';
  import type { Schema } from '../amplify/data/resource'; // adjust path if needed

  export const client: Client<Schema>;
}
