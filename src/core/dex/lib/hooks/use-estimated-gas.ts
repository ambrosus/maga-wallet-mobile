import { useCallback } from 'react';
import { ethers } from 'ethers';
import { bnZERO } from '@constants';
import { useSwapContextSelector } from '@core/dex/context';
import {
  calculateAllowanceWithProviderFee,
  calculateGasMargin
} from '@core/dex/utils';
import { useNativeCurrency, useWallet } from '@lib';
import { createAMBProvider } from '@lib/crypto';
import { devLogger } from '@utils';
import { useSwapActions } from './use-swap-actions';
import { checkIsApprovalRequired, increaseAllowance } from '../contracts';
import { useSwapTokens } from './use-swap-tokens';

type BaseEstimatedGasArgs = {
  amountIn?: string;
  amountOut?: string;
};

export function useEstimatedGas() {
  const { privateKey, wallet } = useWallet();
  const { createNativeCurrencyInstance } = useNativeCurrency();
  const { tokenToSell } = useSwapTokens();
  const { swapCallback } = useSwapActions();
  const { setIsInsufficientBalance } = useSwapContextSelector();

  const baseProviderFee = useCallback(
    async (estimatedGas: ethers.BigNumber) => {
      const provider = createAMBProvider();
      try {
        const { gasPrice } = await provider.getFeeData();
        devLogger(
          `🟢 Gas price ${ethers.utils.formatEther(gasPrice ?? bnZERO)}`
        );

        const gasWithMargin = calculateGasMargin(estimatedGas);

        const gasPriceNumber = gasPrice ? gasPrice.toNumber() : 0;
        const estimatedGasNumber = gasWithMargin.toNumber();

        const totalWei = Math.floor(
          estimatedGasNumber * gasPriceNumber
        ).toString();

        devLogger(
          `🟢 Total gas ${ethers.utils.formatEther(totalWei ?? bnZERO)}`
        );
        return ethers.utils.parseUnits(totalWei, 'wei');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return bnZERO;
      }
    },
    []
  );

  const isEnoughBalanceToCoverGas = useCallback(
    async (gasValue: ethers.BigNumber) => {
      setIsInsufficientBalance(false);

      const { balance } = await createNativeCurrencyInstance(
        wallet?.address ?? ''
      );

      const parsedBalance = ethers.utils.parseEther(
        balance.formattedBalance ?? '0'
      );

      setIsInsufficientBalance(parsedBalance.lt(gasValue));
    },
    [createNativeCurrencyInstance, setIsInsufficientBalance, wallet?.address]
  );

  const estimatedSwapGas = useCallback(
    async (args?: BaseEstimatedGasArgs) => {
      return await swapCallback({ ...args, estimateGas: true });
    },
    [swapCallback]
  );

  const estimatedApprovalGas = useCallback(
    async (args?: Pick<BaseEstimatedGasArgs, 'amountIn'>) => {
      const { amountIn } = args ?? {};

      const amountWithFee = calculateAllowanceWithProviderFee(
        amountIn || tokenToSell.AMOUNT
      );

      const bnAmountToSell = ethers.utils.parseEther(amountWithFee);

      const hasIncreaseAllowance = await checkIsApprovalRequired({
        address: tokenToSell.TOKEN?.address ?? '',
        privateKey,
        amount: bnAmountToSell
      });

      if (hasIncreaseAllowance) {
        const estimatedGas = await increaseAllowance({
          address: tokenToSell.TOKEN?.address ?? '',
          privateKey,
          amount: bnAmountToSell,
          estimateGas: true
        });

        return await baseProviderFee(estimatedGas);
      }

      return bnZERO;
    },
    [
      baseProviderFee,
      privateKey,
      tokenToSell.AMOUNT,
      tokenToSell.TOKEN?.address
    ]
  );

  return {
    estimatedSwapGas,
    estimatedApprovalGas,
    isEnoughBalanceToCoverGas
  };
}
