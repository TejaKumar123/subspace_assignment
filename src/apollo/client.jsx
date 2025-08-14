import { ApolloClient, InMemoryCache, split, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient as createWSClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import nhost from '../utils/nhostClient';

// HTTP link for queries/mutations
const httpLink = createHttpLink({
  uri: nhost.graphql.httpUrl,
});

// Middleware to attach JWT token for HTTP
const authLink = setContext(async (_, { headers }) => {
  const accessToken = await nhost.auth.getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  };
});

// WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
  createWSClient({
    url: nhost.graphql.wsUrl,
    connectionParams: async () => {
      const accessToken = await nhost.auth.getAccessToken();
      return {
        headers: {
          authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      };
    },
  })
);

// Split: Subscriptions → WS, else → HTTP
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink) // HTTP link wrapped with auth
);

// Apollo client
export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
