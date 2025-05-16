import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ApolloEndpointsKeys } from '@lib/apollo';
import { AwaitCurrencyResponse, useCurrenciesStore } from '@store/currencies';
import { GET_CURRENCIES_QUERY } from '../../../queries/currencies/currencies.graph';

export const useCurrenciesQuery = () => {
  const { onSetCurrencies } = useCurrenciesStore();
  const { data, loading, refetch } = useQuery<AwaitCurrencyResponse>(
    GET_CURRENCIES_QUERY,
    {
      pollInterval: 3 * 60 * 1000, // Poll every 3 minutes,
      context: { apiName: ApolloEndpointsKeys.CURRENCY }
    }
  );

  useEffect(() => {
    if (data?.tokens && data.tokens.length > 0) onSetCurrencies(data.tokens);
  }, [data, onSetCurrencies]);

  return { onRefetchCurrenciesList: refetch, loading };
};
