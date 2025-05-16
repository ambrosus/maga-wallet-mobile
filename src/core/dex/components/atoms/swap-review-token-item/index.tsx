import { useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Typography, Spacer } from '@components/atoms';
import { TokenLogo } from '@components/molecules';
import { COLORS, FONT_SIZE } from '@constants';
import { useSwapContextSelector } from '@core/dex/context';
import { useSwapReviewTransformer } from '@core/dex/lib/hooks';
import { FIELD } from '@core/dex/types';
import { SwapStringUtils } from '@core/dex/utils';
import { verticalScale } from '@utils';
import { styles } from './styles';

interface SwapReviewTokenItemProps {
  type: keyof typeof FIELD;
}

export const SwapReviewTokenItem = ({ type }: SwapReviewTokenItemProps) => {
  const { selectedTokens } = useSwapContextSelector();
  const { label, amount } = useSwapReviewTransformer(type);

  const token = SwapStringUtils.extendedLogoVariants(
    selectedTokens[type]?.symbol ?? ''
  );

  const combinedTypeContainerStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      ...styles.container,
      paddingTop: type === FIELD.TOKEN_B ? verticalScale(8) : 0,
      paddingBottom: type === FIELD.TOKEN_A ? verticalScale(8) : 0
    };
  }, [type]);

  return (
    <View style={combinedTypeContainerStyle}>
      <Typography
        fontSize={FONT_SIZE.body.lg}
        fontFamily="Onest600SemiBold"
        color={COLORS.neutral500}
      >
        {label}
      </Typography>
      <View style={styles.inner}>
        <TokenLogo token={token} scale={0.65} />
        <Spacer horizontal value={4} />
        <Typography
          fontSize={FONT_SIZE.body.xl}
          fontFamily="Onest600SemiBold"
          color={COLORS.textPrimary}
        >
          {SwapStringUtils.transformAmountValue(amount)}{' '}
          {selectedTokens[type]?.symbol}
        </Typography>
      </View>
    </View>
  );
};
