import { useQuery } from '@apollo/client';
import { AppValidators } from '@constants';
import { ApolloEndpointsKeys } from '@lib/apollo';
import { AMBRODEO_TOKEN } from '@queries/rodeo-tokens';
import { RodeoToken } from '@queries/rodeo-tokens/types';

export function useRodeoSingleTokenQuery(id: string | undefined) {
  const { data, loading } = useQuery<{ token: RodeoToken }>(AMBRODEO_TOKEN, {
    context: { apiName: ApolloEndpointsKeys.AMBRODEO_TOKENS },
    variables: { id: id?.toLowerCase() },
    skip: !id || AppValidators.ethereumAddress.test(id) === false,
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  return { data, loading };
}
