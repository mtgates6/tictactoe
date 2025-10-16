import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Game: a
    .model({
      id: a.id(),
      playerX: a.string(),
      playerO: a.string(),
      board: a.string().array(),
      currentTurn: a.string(),
      winner: a.string(),
    })
    // Define authorization here — public API key
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});
