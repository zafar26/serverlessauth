import { GraphQLClient } from "graphql-request";
import "cross-fetch/polyfill";

const HASURA_API_URL = process.env.HASURA_API_URL;
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;

const graphQLClient = new GraphQLClient(HASURA_API_URL, {
  headers: {
    "X-Hasura-Admin-Secret": HASURA_ADMIN_SECRET,
  },
});

export const fetcher = async (query, variables) =>
  await graphQLClient.request(query, variables);

export const mutator = async (mutation, variables) =>
  await graphQLClient.request(mutation, variables);
