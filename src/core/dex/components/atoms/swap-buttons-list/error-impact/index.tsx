import { useMemo } from 'react';
import { ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Spinner, Typography } from '@components/atoms';
import { COLORS } from '@constants';
import { useSwapContextSelector } from '@core/dex/context';
import { useSwapSettings } from '@core/dex/lib/hooks';
import { AllowanceStatus } from '@core/dex/types';
import { styles } from './styles';
import { PriceImpactErrorColors } from '../utils/colors';

interface SwapErrorImpactButtonProps {
  isProcessingSwap: boolean;
  onCompleteMultiStepSwap: () => void;
  minimized?: boolean;
}

export const SwapErrorImpactButton = ({
  isProcessingSwap,
  onCompleteMultiStepSwap,
  minimized = false
}: SwapErrorImpactButtonProps) => {
  const { t } = useTranslation();
  const {
    uiBottomSheetInformation: { priceImpact, allowance }
  } = useSwapContextSelector();
  const {
    settings: {
      current: { extendedMode }
    },
    isAutoApprovalEnabled
  } = useSwapSettings();

  const { isInsufficientBalance } = useSwapContextSelector();

  const buttonStyle = useMemo<StyleProp<ViewStyle>>(() => {
    return minimized ? { flex: 1 } : {};
  }, [minimized]);

  const disabled = useMemo(() => {
    if (priceImpact) {
      return (
        (!isAutoApprovalEnabled && allowance === AllowanceStatus.INCREASE) ||
        (priceImpact > 10 && !extendedMode) ||
        isProcessingSwap
      );
    }

    return false;
  }, [
    allowance,
    extendedMode,
    isAutoApprovalEnabled,
    isProcessingSwap,
    priceImpact
  ]);

  const buttonActionString = useMemo(() => {
    if (minimized) {
      return t('swap.buttons.processSwap.anyway');
    }

    if (isInsufficientBalance) {
      return t('buttons.insufficient');
    }

    if (priceImpact) {
      if (priceImpact > 10 && !extendedMode) {
        return t('swap.buttons.processSwap.impact.high');
      } else {
        return t('swap.buttons.processSwap.anyway');
      }
    }
  }, [minimized, isInsufficientBalance, priceImpact, t, extendedMode]);

  const buttonColors = useMemo(() => {
    if (priceImpact && priceImpact >= 5 && priceImpact < 10) {
      return PriceImpactErrorColors.expert;
    }

    return PriceImpactErrorColors[
      !extendedMode ||
      (!isAutoApprovalEnabled && allowance === AllowanceStatus.INCREASE)
        ? 'default'
        : ('expert' as keyof typeof PriceImpactErrorColors)
    ];
  }, [allowance, extendedMode, isAutoApprovalEnabled, priceImpact]);

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.button, buttonStyle, { backgroundColor: buttonColors }]}
      onPress={onCompleteMultiStepSwap}
    >
      {isProcessingSwap ? (
        <Spinner />
      ) : (
        <Typography
          fontSize={16}
          fontFamily="Onest600SemiBold"
          color={COLORS.white}
        >
          {buttonActionString}
        </Typography>
      )}
    </TouchableOpacity>
  );
};
