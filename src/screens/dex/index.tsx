import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeViewContainer, Typography } from '@components/atoms';
import { Button, Header } from '@components/molecules';
import { SettingsFilledIcon } from '@components/svgs';
import { COLORS } from '@constants';
import {
  SwapForm,
  BottomSheetTokensList
} from '@core/dex/components/templates';
import { useSwapContextSelector } from '@core/dex/context';
import { useSwapAllBalances, useAllLiquidityPools } from '@core/dex/lib/hooks';
import { FIELD } from '@core/dex/types';
import { useEffectOnce } from '@lib';
import { HOME_STACK_ROUTES, HomeTabParamsList } from '@navigation';
import { NavigationScreenProps } from '@navigation/types';
import { styles } from './styles';

type Props = NavigationScreenProps<HomeTabParamsList, 'DEXScreen'>;

export const DEXScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();

  useSwapAllBalances();

  const { getAllPoolsCount } = useAllLiquidityPools();
  const { bottomSheetTokenARef, bottomSheetTokenBRef, reset } =
    useSwapContextSelector();

  useEffectOnce(() => {
    getAllPoolsCount();
  });

  useFocusEffect(
    useCallback(() => {
      const resetActions = ['RESET', 'GO_BACK'];

      const unsubscribe = navigation.addListener('beforeRemove', (event) => {
        const {
          data: {
            action: { type }
          }
        } = event;

        if (resetActions.includes(type)) reset();
      });

      return unsubscribe;
    }, [navigation, reset])
  );

  const onNavigateToSettings = useCallback(
    () => navigation.navigate(HOME_STACK_ROUTES.DexSettingsScreen),
    [navigation]
  );

  const renderHeaderRightContent = useMemo(() => {
    return (
      <Button onPress={onNavigateToSettings}>
        <SettingsFilledIcon />
      </Button>
    );
  }, [onNavigateToSettings]);

  return (
    <SafeViewContainer style={styles.container}>
      <Header
        closeIconVisible
        backIconVisible={false}
        title={t('account.actions.swap')}
        contentRight={renderHeaderRightContent}
      />

      <SwapForm />

      <BottomSheetTokensList ref={bottomSheetTokenARef} type={FIELD.TOKEN_A} />
      <BottomSheetTokensList ref={bottomSheetTokenBRef} type={FIELD.TOKEN_B} />

      <View style={[styles.footer, { bottom }]}>
        <Typography
          fontSize={12}
          fontFamily="Onest500Medium"
          color={COLORS.neutral700}
          align="center"
        >
          Securely powered by Astra DEX
        </Typography>
      </View>
    </SafeViewContainer>
  );
};
