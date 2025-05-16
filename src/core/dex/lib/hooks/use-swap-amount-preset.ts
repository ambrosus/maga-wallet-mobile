import { useCallback } from 'react';
import { ethers } from 'ethers';
import {
  BASE_PERCENTS_PRESET,
  ETH_DECIMALS,
  KEYBOARD_OPENING_TIME
} from '@constants';
import { useSwapContextSelector } from '@core/dex/context';
import { FIELD, SelectedTokensKeys } from '@core/dex/types';
import { NumberUtils } from '@utils';
import { useSwapActions } from './use-swap-actions';
import { useSwapBetterCurrency } from './use-swap-better-currency';
import { useSwapFieldsHandler } from './use-swap-fields-handler';

type PresetCallbackArgs = {
  type: SelectedTokensKeys;
  bnBalanceAmount: ethers.BigNumber | null;
  value: (typeof BASE_PERCENTS_PRESET)[number];
};

const MAX_PRESET_VALUE = 100;

export const useSwapAmountPreset = () => {
  const {
    selectedTokens,
    setSelectedTokensAmount,
    setIsExactIn,
    setIsInsufficientBalance,
    setIsExtractingMaxPrice
  } = useSwapContextSelector();
  const { onSelectMaxTokensAmount, updateReceivedTokensOutput } =
    useSwapFieldsHandler();

  const { swapCallback } = useSwapActions();
  const { bestTradeCurrency } = useSwapBetterCurrency();

  const onPresetAmountPress = useCallback(
    async ({ type, bnBalanceAmount, value }: PresetCallbackArgs) => {
      setIsExtractingMaxPrice(true);
      setIsExactIn(type === FIELD.TOKEN_A);

      if (!bnBalanceAmount) return;

      try {
        setTimeout(async () => {
          const parsedBalance = ethers.utils.formatEther(bnBalanceAmount);

          const amountWithPercentApplied =
            value === MAX_PRESET_VALUE
              ? parsedBalance
              : NumberUtils.limitDecimalCount(
                  (Number(parsedBalance) * Number(value)) / 100,
                  ETH_DECIMALS
                );

          const bnAmountToSpend = ethers.utils.parseEther(
            amountWithPercentApplied
          );

          const isNative =
            type === FIELD.TOKEN_A &&
            selectedTokens.TOKEN_A.address === ethers.constants.AddressZero;

          if (isNative) {
            const bnAmountToReceive = await bestTradeCurrency(
              amountWithPercentApplied,
              [selectedTokens.TOKEN_A.address, selectedTokens.TOKEN_B.address]
            );

            const estimatedGas = await swapCallback({
              amountIn: amountWithPercentApplied,
              amountOut: ethers.utils.formatEther(bnAmountToReceive),
              estimateGas: true,
              tradeIn: type === FIELD.TOKEN_A
            });

            const maxSpendableAmount = bnAmountToSpend.sub(estimatedGas);

            if (maxSpendableAmount.lt(0)) {
              setIsInsufficientBalance(true);
              setSelectedTokensAmount({
                [FIELD.TOKEN_A]: '0',
                [FIELD.TOKEN_B]: ''
              });
              return;
            }

            const amount = NumberUtils.limitDecimalCount(
              ethers.utils.formatEther(maxSpendableAmount),
              ETH_DECIMALS
            );

            onSelectMaxTokensAmount(type, amount);
          } else {
            const amount = NumberUtils.limitDecimalCount(
              ethers.utils.formatEther(bnAmountToSpend),
              ETH_DECIMALS
            );

            onSelectMaxTokensAmount(type, amount);
          }

          setTimeout(() => {
            updateReceivedTokensOutput();
          });
        }, KEYBOARD_OPENING_TIME);
      } catch (error) {
        throw error;
      } finally {
        setIsExtractingMaxPrice(false);
      }
    },
    [
      bestTradeCurrency,
      onSelectMaxTokensAmount,
      selectedTokens.TOKEN_A.address,
      selectedTokens.TOKEN_B.address,
      setIsExactIn,
      setIsExtractingMaxPrice,
      setIsInsufficientBalance,
      setSelectedTokensAmount,
      swapCallback,
      updateReceivedTokensOutput
    ]
  );

  return { onPresetAmountPress };
};
