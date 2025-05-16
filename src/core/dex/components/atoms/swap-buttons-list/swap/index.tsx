import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RowContainer, Spinner, Typography } from '@components/atoms';
import { PrimaryButton } from '@components/molecules';
import { COLORS } from '@constants';
import { useSwapContextSelector } from '@core/dex/context';
import { isETHtoWrapped, isWrappedToETH } from '@core/dex/utils';
import { styles } from '../styles';

interface SwapButtonProps {
  isProcessingSwap: boolean;
  onCompleteMultiStepSwap: () => void;
}

export const SwapButton = ({
  isProcessingSwap,
  onCompleteMultiStepSwap
}: SwapButtonProps) => {
  const { t } = useTranslation();
  const { selectedTokens, isInsufficientBalance } = useSwapContextSelector();

  const disabled = useMemo(
    () => isProcessingSwap || isInsufficientBalance,
    [isInsufficientBalance, isProcessingSwap]
  );

  const buttonActionString = useMemo(() => {
    const { TOKEN_A, TOKEN_B } = selectedTokens;

    if (TOKEN_A && TOKEN_B) {
      if (isETHtoWrapped([TOKEN_A.address, TOKEN_B.address])) {
        return t('swap.button.wrap');
      } else if (isWrappedToETH([TOKEN_A.address, TOKEN_B.address])) {
        return t('swap.button.unwrap');
      }
    }

    if (isInsufficientBalance) {
      return t('buttons.insufficient');
    }

    return t('buttons.confirm');
  }, [isInsufficientBalance, selectedTokens, t]);

  return (
    <PrimaryButton
      disabled={disabled}
      onPress={onCompleteMultiStepSwap}
      style={styles.button}
    >
      {isProcessingSwap ? (
        <RowContainer style={styles.pendingLayout} alignItems="center">
          <Spinner size="xs" />
          <Typography
            fontSize={16}
            fontFamily="Onest600SemiBold"
            color={COLORS.primary500}
          >
            {t('swap.buttons.processSwap.loading')}
          </Typography>
        </RowContainer>
      ) : (
        <Typography
          fontSize={16}
          fontFamily="Onest600SemiBold"
          color={disabled ? COLORS.primary300 : COLORS.white}
        >
          {buttonActionString}
        </Typography>
      )}
    </PrimaryButton>
  );
};
