import { useCallback, useMemo } from 'react';
import { Image, View } from 'react-native';
import { SafeViewContainer, Spacer, Typography } from '@components/atoms';
import { Button } from '@components/molecules';
import { SuccessIconWrapped } from '@components/svgs';
import { DEVICE_WIDTH, DEVICE_HEIGHT, FONT_SIZE, COLORS } from '@constants';
import { useSwapContextSelector } from '@core/dex/context';
import { useSwapTokens } from '@core/dex/lib/hooks';
import { HOME_STACK_ROUTES } from '@navigation';
import { RootNavigationScreenProps } from '@navigation/root-stack';
import { NumberUtils } from '@utils';
import { styles } from './styles';

type Props = RootNavigationScreenProps<'DexSuccessScreen'>;

export const DexSuccessScreen = ({ navigation }: Props) => {
  const { tokenToReceive } = useSwapTokens();
  const { reset } = useSwapContextSelector();

  const onNavigate = useCallback(() => {
    reset();
    navigation.replace(HOME_STACK_ROUTES.DEXScreen);
  }, [navigation, reset]);

  const amount = useMemo(() => {
    return NumberUtils.numberToTransformedLocale(tokenToReceive.AMOUNT);
  }, [tokenToReceive.AMOUNT]);

  const symbol = useMemo(
    () => tokenToReceive.TOKEN.symbol,
    [tokenToReceive.TOKEN.symbol]
  );

  return (
    <SafeViewContainer style={styles.container}>
      <Image
        style={styles.background}
        width={DEVICE_WIDTH}
        height={DEVICE_HEIGHT}
        source={require('@assets/images/create-wallet-background.png')}
      />

      <View style={styles.innerContainer}>
        <View style={styles.successContainer}>
          <SuccessIconWrapped />
          <Spacer value={16} />
          <Typography
            fontSize={FONT_SIZE.heading.xl}
            fontFamily="Onest600SemiBold"
            color={COLORS.textPrimary}
            letterSpacing={-1}
          >
            Success!
          </Typography>
          <Spacer value={8} />
          <Typography
            fontSize={FONT_SIZE.body.lg}
            fontFamily="Onest500Medium"
            color={COLORS.textPrimary}
          >
            You received {amount} {symbol}.
          </Typography>
        </View>
      </View>

      <Button onPress={onNavigate} style={styles.button}>
        <Typography
          fontSize={FONT_SIZE.default}
          fontFamily="Onest600SemiBold"
          color={COLORS.white}
        >
          Done
        </Typography>
      </Button>
    </SafeViewContainer>
  );
};
