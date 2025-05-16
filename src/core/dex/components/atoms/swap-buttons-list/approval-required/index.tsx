import { useMemo } from 'react';
import { StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RowContainer } from '@components/atoms';
import { TextOrSpinner } from '@components/molecules';
import { COLORS } from '@constants';
import { useSwapContextSelector } from '@core/dex/context';
import { AllowanceStatus } from '@core/dex/types';
import { SwapErrorImpactButton } from '../error-impact';
import { styles } from '../styles';

interface ApprovalRequiredButtonProps {
  isIncreasingAllowance: boolean;
  isProcessingSwap: boolean;
  onCompleteMultiStepSwap: () => void;
}

export const ApprovalRequiredButton = ({
  isIncreasingAllowance,
  isProcessingSwap,
  onCompleteMultiStepSwap
}: ApprovalRequiredButtonProps) => {
  const { t } = useTranslation();
  const {
    uiBottomSheetInformation: { allowance, priceImpact },
    latestSelectedTokens
  } = useSwapContextSelector();

  const isPriceImpactHighlighted = useMemo(() => {
    return priceImpact && priceImpact >= 5;
  }, [priceImpact]);

  const multiStepButtonsDisabledStates = useMemo(() => {
    return {
      primary: allowance === AllowanceStatus.INCREASED || isIncreasingAllowance,
      secondary: allowance === AllowanceStatus.INCREASE || isProcessingSwap
    };
  }, [isIncreasingAllowance, isProcessingSwap, allowance]);

  const multiStepButtonActionText = useMemo(() => {
    if (allowance !== AllowanceStatus.SUITABLE) {
      const selectedTokens = latestSelectedTokens.current.TOKEN_A;

      return {
        firstStep: t('buttons.approve', {
          symbol: selectedTokens?.symbol
        }),
        secondStep: t('swap.buttons.processSwap')
      };
    }
  }, [t, latestSelectedTokens, allowance]);

  const multiStepSecondaryButtonStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      ...styles.multiStepButton,
      backgroundColor:
        allowance === AllowanceStatus.INCREASED && !isProcessingSwap
          ? COLORS.primary500
          : COLORS.primary300
    };
  }, [isProcessingSwap, allowance]);

  return (
    <RowContainer alignItems="center" gap={24}>
      <TouchableOpacity
        style={[styles.approveButton, styles.multiStepButton]}
        disabled={multiStepButtonsDisabledStates.primary}
        onPress={onCompleteMultiStepSwap}
      >
        <TextOrSpinner
          loading={isIncreasingAllowance}
          label={multiStepButtonActionText?.firstStep || ''}
          styles={{
            active: {
              fontSize: 16,
              fontFamily: 'Onest600SemiBold',
              color: multiStepButtonsDisabledStates.primary
                ? COLORS.primary300
                : COLORS.primary500
            }
          }}
        />
      </TouchableOpacity>
      {isPriceImpactHighlighted ? (
        <SwapErrorImpactButton
          isProcessingSwap={isProcessingSwap}
          onCompleteMultiStepSwap={onCompleteMultiStepSwap}
          minimized
        />
      ) : (
        <TouchableOpacity
          style={[multiStepSecondaryButtonStyle, styles.swapButton]}
          disabled={multiStepButtonsDisabledStates.secondary}
          onPress={onCompleteMultiStepSwap}
        >
          <TextOrSpinner
            loading={isProcessingSwap}
            label={multiStepButtonActionText?.secondStep || ''}
            styles={{
              active: {
                fontSize: 16,
                fontFamily: 'Onest600SemiBold',
                color: multiStepButtonsDisabledStates.secondary
                  ? COLORS.primary100
                  : COLORS.white
              }
            }}
          />
        </TouchableOpacity>
      )}
    </RowContainer>
  );
};
