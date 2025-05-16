import { Children, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  PercentPressableContainer,
  RowContainer,
  Typography
} from '@components/atoms';
import { COLORS } from '@constants';
import { SettingsInputWithLabel } from '@core/dex/components/molecules';
import { INITIAL_SLIPPAGE_TOLERANCE } from '@core/dex/context/initials';
import { SettingsKeys } from '@core/dex/types';
import { slippageErrorHandler, SwapStringUtils } from '@core/dex/utils';
import { styles } from './styles';

interface SettingsSlippageFormProps {
  slippageTolerance: string;
  setSlippageTolerance: (sKey: SettingsKeys, value: string) => void;
}

const SLIPPAGE_TOLERANCE_OPTIONS = [0.1, 0.5, 1];

export const SettingsSlippageForm = ({
  slippageTolerance,
  setSlippageTolerance
}: SettingsSlippageFormProps) => {
  const { t } = useTranslation();

  const onChangeSlippageToleranceHandle = useCallback(
    (value: string) => {
      setSlippageTolerance('slippageTolerance', value);
    },
    [setSlippageTolerance]
  );

  const onPresetSlippageToleranceHandle = useCallback(
    (value: number) => {
      if (value.toString().includes('.')) {
        const newValue = value + '0';
        return setSlippageTolerance('slippageTolerance', String(newValue));
      }

      const newValue = value + '.00';
      return setSlippageTolerance('slippageTolerance', String(newValue));
    },
    [setSlippageTolerance]
  );

  const onChangeSlippageBlur = useCallback(() => {
    const newValue = SwapStringUtils.transformSlippageOnBlur(slippageTolerance);
    return setSlippageTolerance(
      'slippageTolerance',
      newValue ?? INITIAL_SLIPPAGE_TOLERANCE
    );
  }, [setSlippageTolerance, slippageTolerance]);

  const error = useMemo(
    () => slippageErrorHandler(slippageTolerance),
    [slippageTolerance]
  );

  const slippageDescriptionHighlight = useMemo(() => {
    if (!error) return COLORS.textSecondary;

    if (error === t('swap.settings.slippage.errors.invalid'))
      return COLORS.destructive500;

    return COLORS.warning500;
  }, [error, t]);

  const inputBorderStyle = useMemo(() => {
    if (error) return { borderColor: slippageDescriptionHighlight };
    return { borderColor: COLORS.primary500 };
  }, [error, slippageDescriptionHighlight]);

  return (
    <View style={styles.container}>
      <SettingsInputWithLabel
        label="%"
        heading="Slippage Tolerance"
        placeholder="Custom"
        value={slippageTolerance}
        onChangeText={onChangeSlippageToleranceHandle}
        onBlur={onChangeSlippageBlur}
        inputStyle={[styles.input, inputBorderStyle]}
      />

      {error && (
        <View style={styles.errorContainer}>
          <Typography
            fontSize={12}
            fontFamily="Onest500Medium"
            color={slippageDescriptionHighlight}
          >
            {error}
          </Typography>
        </View>
      )}

      <RowContainer alignItems="center" gap={10}>
        {Children.toArray(
          SLIPPAGE_TOLERANCE_OPTIONS.map((value, index) => (
            <PercentPressableContainer
              key={index}
              value={value}
              onPress={onPresetSlippageToleranceHandle}
              style={styles.pressableContainer}
              typographyStyle={styles.typography}
            />
          ))
        )}
      </RowContainer>
    </View>
  );
};
