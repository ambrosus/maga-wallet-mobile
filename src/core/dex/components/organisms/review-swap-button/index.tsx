import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontFamily } from '@components/atoms/typography/types';
import { PrimaryButton, TextOrSpinner } from '@components/molecules';
import { COLORS } from '@constants';
import { useSwapContextSelector } from '@core/dex/context';
import { useSwapInterface, useSwapMultiplyBalance } from '@core/dex/lib/hooks';
import { buttonActionString } from '@core/dex/utils';

function buttonStyles(disabled: boolean) {
  return {
    active: {
      fontSize: 17,
      fontFamily: 'Inter_600SemiBold' as FontFamily,
      color: disabled ? COLORS.primary100 : COLORS.white
    },
    loading: {
      fontSize: 17,
      fontFamily: 'Inter_600SemiBold' as FontFamily,
      color: COLORS.primary100
    }
  };
}

export const ReviewSwapButton = () => {
  const { t } = useTranslation();
  const { bnBalances } = useSwapMultiplyBalance();
  const { resolveBottomSheetData } = useSwapInterface();
  const {
    isLockedAfterReverse,
    isPoolsLoading,
    isExecutingPrice,
    selectedTokens,
    selectedTokensAmount,
    isWarningToEnableMultihopActive,
    isExtractingMaxPrice
  } = useSwapContextSelector();

  const [isProcessingBottomSheet, setIsProcessingBottomSheet] = useState(false);

  const swapButtonString = useMemo(() => {
    if (isWarningToEnableMultihopActive) {
      return 'Enable multihops trade';
    }

    return buttonActionString(
      selectedTokens,
      selectedTokensAmount,
      bnBalances,
      t
    );
  }, [
    isWarningToEnableMultihopActive,
    selectedTokens,
    selectedTokensAmount,
    bnBalances,
    t
  ]);

  const onResolveBottomSheetDataPress = useCallback(async () => {
    try {
      setIsProcessingBottomSheet(true);
      await resolveBottomSheetData();
    } catch (error) {
      throw error;
    } finally {
      setIsProcessingBottomSheet(false);
    }
  }, [resolveBottomSheetData]);

  const disabled = useMemo(() => {
    return (
      swapButtonString !== t('buttons.review') ||
      isProcessingBottomSheet ||
      isExecutingPrice ||
      isPoolsLoading ||
      isExtractingMaxPrice ||
      isLockedAfterReverse
    );
  }, [
    swapButtonString,
    t,
    isProcessingBottomSheet,
    isExecutingPrice,
    isPoolsLoading,
    isExtractingMaxPrice,
    isLockedAfterReverse
  ]);

  return (
    <PrimaryButton disabled={disabled} onPress={onResolveBottomSheetDataPress}>
      <TextOrSpinner
        label={swapButtonString}
        loadingLabel={undefined}
        spinnerColor={COLORS.white}
        loading={
          isExecutingPrice ||
          isProcessingBottomSheet ||
          isPoolsLoading ||
          isLockedAfterReverse
        }
        styles={buttonStyles(disabled)}
      />
    </PrimaryButton>
  );
};
