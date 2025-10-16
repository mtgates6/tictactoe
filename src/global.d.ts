declare module '@amplifyClient' {
  import type { Client } from 'aws-amplify/data';
  import type { Schema } from '../amplify/data/resource'; // adjust path if needed

  export const client: Client<Schema>;
}

// Allow importing JSON modules without type errors (used for optional amplify_outputs.json)
declare module '*.json' {
  const value: any;
  export default value;
}