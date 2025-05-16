import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import {
  SettingsInputWithLabel,
  SettingsToggleContainer
} from '@core/dex/components/molecules';
import { SettingsSlippageForm } from '@core/dex/components/organisms';
import { useSwapFieldsHandler } from '@core/dex/lib/hooks';
import { Settings, SettingsKeys } from '@core/dex/types';
import { styles } from './styles';

interface SettingsFormProps {
  settings: Settings;
  onChangeSettings: (key: SettingsKeys, value: string | boolean) => void;
}

export const SettingsForm = ({
  settings,
  onChangeSettings
}: SettingsFormProps) => {
  const { updateReceivedTokensOutput } = useSwapFieldsHandler();

  const { slippageTolerance, deadline, extendedMode, multihops, autoApproval } =
    useMemo(() => settings, [settings]);

  const onChangeDeadline = useCallback(
    (payload: string) => onChangeSettings('deadline', payload),
    [onChangeSettings]
  );

  const onToggleExtendedMode = useCallback(() => {
    onChangeSettings('extendedMode', !extendedMode);
  }, [extendedMode, onChangeSettings]);

  const onToggleMultihops = useCallback(() => {
    onChangeSettings('multihops', !multihops);

    setTimeout(async () => {
      await updateReceivedTokensOutput();
    });
  }, [multihops, onChangeSettings, updateReceivedTokensOutput]);

  const onToggleAutoApproval = useCallback(
    () => onChangeSettings('autoApproval', !autoApproval),
    [autoApproval, onChangeSettings]
  );

  return (
    <View style={styles.container}>
      <SettingsSlippageForm
        slippageTolerance={slippageTolerance}
        setSlippageTolerance={onChangeSettings}
      />

      <SettingsInputWithLabel
        label="minutes"
        heading="Transaction Deadline"
        value={deadline}
        onChangeText={onChangeDeadline}
      />

      <View style={styles.togglersContainer}>
        <SettingsToggleContainer
          borderBottom
          heading="Expert Mode"
          value={extendedMode}
          onToggle={onToggleExtendedMode}
        />

        <SettingsToggleContainer
          borderBottom
          heading="Multihops"
          value={multihops}
          onToggle={onToggleMultihops}
        />

        <SettingsToggleContainer
          heading="Auto-Approval"
          description="Automatically approve transactions without prompts."
          value={autoApproval}
          onToggle={onToggleAutoApproval}
        />
      </View>
    </View>
  );
};
