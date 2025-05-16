import { useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { ApolloEndpointsKeys } from '@lib/apollo';
import { AMBRODEO_TOKENS } from '@queries/rodeo-tokens';
import { RodeoToken } from '@queries/rodeo-tokens/types';
import { useRodeoTokensStore } from '@store/rodeo-tokens';

type TokensQuery = {
  tokens: RodeoToken[];
};

export function useRodeoTokensListQuery() {
  const { tokens: allRodeoTokens, onChangeRodeoTokens } = useRodeoTokensStore();

  const { data, loading } = useQuery<TokensQuery>(AMBRODEO_TOKENS, {
    pollInterval: 60 * 1000, // Poll every minute,
    context: { apiName: ApolloEndpointsKeys.AMBRODEO_TOKENS },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const tokens = useMemo(() => data?.tokens || [], [data]);

  useEffect(() => {
    if (allRodeoTokens.length !== tokens.length) {
      onChangeRodeoTokens(tokens);
    }
  }, [tokens, allRodeoTokens, onChangeRodeoTokens]);

  return { tokens, loading };
}
