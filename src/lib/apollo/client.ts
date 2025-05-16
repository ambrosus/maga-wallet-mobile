import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { ApolloEndpoints, ApolloEndpointsKeys } from './endpoints';

const httpLink = createHttpLink({
  uri: ({ getContext }) => {
    const { apiName } = getContext() as { apiName: ApolloEndpointsKeys };

    switch (apiName) {
      case ApolloEndpointsKeys.AMBRODEO_TOKENS:
        return ApolloEndpoints[ApolloEndpointsKeys.AMBRODEO_TOKENS];
      case ApolloEndpointsKeys.CURRENCY:
        return ApolloEndpoints[ApolloEndpointsKeys.CURRENCY];
      default:
        return ApolloEndpoints[ApolloEndpointsKeys.CURRENCY];
    }
  }
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});
