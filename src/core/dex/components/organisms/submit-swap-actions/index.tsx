import { useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Spacer } from '@components/atoms';
import { bnZERO } from '@constants';
import {
  ApprovalRequiredButton,
  SwapButton,
  SwapErrorImpactButton
} from '@core/dex/components/atoms/swap-buttons-list';
import { useSwapContextSelector } from '@core/dex/context';
import {
  useEstimatedGas,
  useSwapActions,
  useSwapSettings
} from '@core/dex/lib/hooks';
import { AllowanceStatus } from '@core/dex/types';
import { HOME_STACK_ROUTES, HomeNavigationProp } from '@navigation';
import { ApprovalBadge } from '../../atoms';

const SWAP_ERROR_TITLE = 'The transaction cannot succeed due to error:';
const SWAP_ERROR_DESCRIPTION =
  'missing revert data in call exception; Transaction reverted without a reason string. This is probably an issue with one of the tokens you are swapping.';

export const SubmitSwapActions = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const {
    uiBottomSheetInformation: { priceImpact, allowance },
    setIsProcessingSwap,
    isProcessingSwap,
    isIncreasingAllowance,
    setIsIncreasingAllowance,
    setEstimatedGasValues,
    isInsufficientBalance
  } = useSwapContextSelector();

  const { setAllowance, swapCallback } = useSwapActions();
  const { estimatedSwapGas, isEnoughBalanceToCoverGas } = useEstimatedGas();
  const { isAutoApprovalEnabled } = useSwapSettings();

  const onCompleteMultiStepSwap = useCallback(async () => {
    if (!isAutoApprovalEnabled && allowance === AllowanceStatus.INCREASE) {
      try {
        setIsIncreasingAllowance(true);
        await setAllowance();

        const estimatedGas = await estimatedSwapGas();

        setEstimatedGasValues({
          swap: estimatedGas,
          approval: bnZERO
        });

        await isEnoughBalanceToCoverGas(estimatedGas);
      } finally {
        setIsIncreasingAllowance(false);
      }
    } else {
      try {
        setIsProcessingSwap(true);
        const tx = await swapCallback({ estimateGas: false });

        if (!tx) {
          // onChangeBottomSheetSwapStatus(BottomSheetStatus.ERROR);
          // sendFirebaseEvent(CustomAppEvents.swap_error, {
          //   swapError: 'swapTokens-tx not found'
          // });
        } else {
          navigation.replace(HOME_STACK_ROUTES.DexSuccessScreen);
          // sendFirebaseEvent(CustomAppEvents.swap_finish);
          // onChangeBottomSheetSwapStatus(BottomSheetStatus.SUCCESS);
        }
      } catch (error) {
        // onChangeBottomSheetSwapStatus(BottomSheetStatus.ERROR);
        // sendFirebaseEvent(CustomAppEvents.swap_error, {
        //   swapError: JSON.stringify(
        //     (error as { message: string })?.message ?? JSON.stringify(error)
        //   )
        // });
        Alert.alert(SWAP_ERROR_TITLE, SWAP_ERROR_DESCRIPTION);
        throw error;
      } finally {
        setIsProcessingSwap(false);
      }
    }
  }, [
    allowance,
    estimatedSwapGas,
    isAutoApprovalEnabled,
    isEnoughBalanceToCoverGas,
    navigation,
    setAllowance,
    setEstimatedGasValues,
    setIsIncreasingAllowance,
    setIsProcessingSwap,
    swapCallback
  ]);

  const hasApprovalRequired = useMemo(() => {
    return !isInsufficientBalance && allowance !== AllowanceStatus.SUITABLE;
  }, [allowance, isInsufficientBalance]);

  // UI Button Elements
  if (isAutoApprovalEnabled && priceImpact && priceImpact > 5) {
    return (
      <SwapErrorImpactButton
        isProcessingSwap={isProcessingSwap}
        onCompleteMultiStepSwap={onCompleteMultiStepSwap}
      />
    );
  }

  if (hasApprovalRequired && !isAutoApprovalEnabled) {
    return (
      <>
        <ApprovalBadge />
        <Spacer value={16} />
        <ApprovalRequiredButton
          isProcessingSwap={isProcessingSwap}
          isIncreasingAllowance={isIncreasingAllowance}
          onCompleteMultiStepSwap={onCompleteMultiStepSwap}
        />
      </>
    );
  }

  return (
    <SwapButton
      isProcessingSwap={isProcessingSwap}
      onCompleteMultiStepSwap={onCompleteMultiStepSwap}
    />
  );
};
