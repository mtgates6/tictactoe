import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';
import { auth } from './auth/resource'; // optional if you later add Cognito

export const backend = defineBackend({
  data,
});