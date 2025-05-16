import { Config } from '@constants';
import { RodeoToken } from '@queries/rodeo-tokens';
import { SwapToken } from '../types';

export const transformTokensObject = (newTokens: RodeoToken[]): SwapToken[] => {
  return [
    ...Config.SWAP_TOKENS,
    ...newTokens.map((token) => {
      const { id: address, name, symbol } = token;

      return { address, name, symbol };
    })
  ];
};
