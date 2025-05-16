import { useCallback, useMemo } from 'react';
import { Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ethers } from 'ethers';
import { bnZERO, COLORS } from '@constants';
import { useSwapContextSelector } from '@core/dex/context';
import { INITIAL_UI_BOTTOM_SHEET_INFORMATION } from '@core/dex/context/initials';
import { AllowanceStatus } from '@core/dex/types';
import {
  SwapStringUtils,
  isETHtoWrapped,
  isWrappedToETH,
  maximumAmountIn,
  minimumAmountOut
} from '@core/dex/utils';
import { HOME_STACK_ROUTES, HomeNavigationProp } from '@navigation';
import { useEstimatedGas } from './use-estimated-gas';
import { useSwapActions } from './use-swap-actions';
import { useSwapHelpers } from './use-swap-helpers';
import { useSwapPriceImpact } from './use-swap-price-impact';
import { useSwapSettings } from './use-swap-settings';
import { useSwapTokens } from './use-swap-tokens';

export function useSwapInterface() {
  const navigation: HomeNavigationProp = useNavigation();

  const {
    uiBottomSheetInformation,
    setUiBottomSheetInformation,
    _refExactGetter,
    setEstimatedGasValues
  } = useSwapContextSelector();

  const { uiPriceImpactGetter } = useSwapPriceImpact();
  const { checkAllowance, swapCallback } = useSwapActions();
  const { settings } = useSwapSettings();
  const { tokenToSell, tokenToReceive } = useSwapTokens();
  const { hasWrapNativeToken, isEmptyAmount } = useSwapHelpers();
  const { estimatedApprovalGas, isEnoughBalanceToCoverGas } = useEstimatedGas();

  const resolveBottomSheetData = useCallback(async () => {
    Keyboard.dismiss();
    setUiBottomSheetInformation(INITIAL_UI_BOTTOM_SHEET_INFORMATION);
    setEstimatedGasValues({ swap: bnZERO, approval: bnZERO });

    const networkFee = await swapCallback({ estimateGas: true });

    if (hasWrapNativeToken) {
      setEstimatedGasValues({
        swap: networkFee,
        approval: bnZERO
      });

      await isEnoughBalanceToCoverGas(networkFee);

      setUiBottomSheetInformation((prevState) => ({
        ...prevState,
        allowance: 'suitable'
      }));

      setTimeout(() => {
        navigation.navigate(HOME_STACK_ROUTES.DexReviewSwapScreen);
      }, 700);
    }

    try {
      const bnMinimumReceivedAmount = minimumAmountOut(
        `${settings.current.slippageTolerance}%`,
        ethers.utils.parseEther(
          _refExactGetter ? tokenToReceive.AMOUNT : tokenToSell.AMOUNT
        )
      );

      const bnMaximumReceivedAmount = maximumAmountIn(
        `${settings.current.slippageTolerance}%`,
        ethers.utils.parseEther(
          _refExactGetter ? tokenToReceive.AMOUNT : tokenToSell.AMOUNT
        )
      );

      const priceImpact = await uiPriceImpactGetter();
      const allowance = await checkAllowance();

      if (!!allowance) {
        const approvalEstimatedGas = await estimatedApprovalGas({
          amountIn: tokenToSell.AMOUNT
        });

        setEstimatedGasValues({ swap: bnZERO, approval: approvalEstimatedGas });
        await isEnoughBalanceToCoverGas(approvalEstimatedGas);
      } else {
        setEstimatedGasValues({
          swap: networkFee,
          approval: bnZERO
        });
        await isEnoughBalanceToCoverGas(networkFee);
      }

      const receivedAmountOut = SwapStringUtils.transformMinAmountValue(
        bnMinimumReceivedAmount
      );

      const receivedMaxAmountOut = SwapStringUtils.transformMinAmountValue(
        bnMaximumReceivedAmount
      );

      const minimumReceivedAmount = !_refExactGetter
        ? receivedMaxAmountOut
        : receivedAmountOut;

      setUiBottomSheetInformation({
        priceImpact: priceImpact ? Number(Number(priceImpact).toFixed(2)) : 0,
        minimumReceivedAmount,
        allowance: allowance
          ? AllowanceStatus.INCREASE
          : AllowanceStatus.SUITABLE
      });

      setTimeout(() => {
        navigation.navigate(HOME_STACK_ROUTES.DexReviewSwapScreen);
      }, 700);
    } catch (error) {
      throw error;
    }
  }, [
    setUiBottomSheetInformation,
    setEstimatedGasValues,
    swapCallback,
    hasWrapNativeToken,
    isEnoughBalanceToCoverGas,
    navigation,
    settings,
    _refExactGetter,
    tokenToReceive.AMOUNT,
    tokenToSell.AMOUNT,
    uiPriceImpactGetter,
    checkAllowance,
    estimatedApprovalGas
  ]);

  const isEstimatedToken = useMemo(() => {
    const isSomeTokenNotSelected = !tokenToSell.TOKEN || !tokenToReceive.TOKEN;
    const isSomeBalanceIsEmpty =
      isEmptyAmount(tokenToSell.AMOUNT) || isEmptyAmount(tokenToReceive.AMOUNT);

    const ethSwapOrUnswapPath = [
      tokenToSell.TOKEN?.address ?? '',
      tokenToReceive.TOKEN?.address ?? ''
    ];

    const isWrapEth = isWrappedToETH(ethSwapOrUnswapPath);
    const isEthUnwrap = isETHtoWrapped(ethSwapOrUnswapPath);
    const combinedSwapOrUnwrapETH = isWrapEth || isEthUnwrap;

    if (
      isSomeBalanceIsEmpty ||
      isSomeTokenNotSelected ||
      combinedSwapOrUnwrapETH
    ) {
      return {
        tokenA: false,
        tokenB: false
      };
    }

    return {
      tokenA: !_refExactGetter,
      tokenB: _refExactGetter
    };
  }, [
    _refExactGetter,
    isEmptyAmount,
    tokenToReceive.AMOUNT,
    tokenToReceive.TOKEN,
    tokenToSell.AMOUNT,
    tokenToSell.TOKEN
  ]);

  const priceImpactHighlight = useMemo(() => {
    const { priceImpact } = uiBottomSheetInformation;

    if (priceImpact !== undefined && priceImpact !== null) {
      if (priceImpact < 0 || priceImpact < 5) return COLORS.neutral500;
      if (priceImpact >= 5) return COLORS.destructive500;
    }
  }, [uiBottomSheetInformation]);

  const isPriceImpactHigh = useMemo(() => {
    return priceImpactHighlight === COLORS.destructive500;
  }, [priceImpactHighlight]);

  return {
    resolveBottomSheetData,
    isEstimatedToken,
    priceImpactHighlight,
    isPriceImpactHigh
  };
}
