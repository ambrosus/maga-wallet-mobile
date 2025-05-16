import { PropsWithChildren } from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from '@lib/apollo';

export const ApolloClientProvider = ({ children }: PropsWithChildren) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);
