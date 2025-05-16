import { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  KeyboardDismissingView,
  SafeViewContainer,
  Typography
} from '@components/atoms';
import { Button, Header, Toast, ToastType } from '@components/molecules';
import { COLORS, FONT_SIZE } from '@constants';
import { SettingsForm } from '@core/dex/components/templates';
import { useSwapFieldsHandler, useSwapSettings } from '@core/dex/lib/hooks';
import { HomeTabParamsList } from '@navigation';
import { NavigationScreenProps } from '@navigation/types';
import { styles } from './styles';

type Props = NavigationScreenProps<HomeTabParamsList, 'DexSettingsScreen'>;

export const DexSettingsScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();

  const { updateReceivedTokensOutput } = useSwapFieldsHandler();

  const { localSettingsState, onChangeSettings, onApplySettingsHandle } =
    useSwapSettings();

  const renderHeaderRightContent = useMemo(() => {
    const onSaveActionHandle = async () => {
      onApplySettingsHandle();

      setTimeout(async () => {
        await updateReceivedTokensOutput({
          multihops: localSettingsState.multihops
        });
      }, 500);

      Toast.show({
        text: t('swap.settings.toast.success'),
        type: ToastType.Success
      });
      navigation.goBack();
    };

    return (
      <Button onPress={onSaveActionHandle}>
        <Typography
          fontSize={FONT_SIZE.default}
          fontFamily="Onest600SemiBold"
          color={COLORS.primary500}
        >
          Save
        </Typography>
      </Button>
    );
  }, [
    localSettingsState.multihops,
    navigation,
    onApplySettingsHandle,
    t,
    updateReceivedTokensOutput
  ]);

  return (
    <SafeViewContainer style={styles.container}>
      <KeyboardDismissingView style={styles.container}>
        <Header
          title={t('swap.settings.title')}
          contentRight={renderHeaderRightContent}
        />

        <View style={styles.innerContainer}>
          <SettingsForm
            settings={localSettingsState}
            onChangeSettings={onChangeSettings}
          />
        </View>
      </KeyboardDismissingView>
    </SafeViewContainer>
  );
};
