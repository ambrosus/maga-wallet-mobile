import { useCallback, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, Platform, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  InputRef,
  RowContainer,
  Spacer,
  TextInput,
  Typography
} from '@components/atoms';
import { BASE_PERCENTS_PRESET, COLORS } from '@constants';
import {
  AmountPresetsContainer,
  Balance,
  TokenSelector
} from '@core/dex/components/molecules';
import { useSwapContextSelector } from '@core/dex/context';
import {
  useSwapAmountPreset,
  useSwapBalance,
  useSwapFieldsHandler,
  useSwapTokens
} from '@core/dex/lib/hooks';
import { FIELD, SelectedTokensKeys } from '@core/dex/types';
import { StringUtils, NumberUtils, verticalScale } from '@utils';
import { styles } from './styles';

interface InputWithTokenSelectProps {
  readonly type: SelectedTokensKeys;
  readonly estimated: boolean;
  readonly borderRadius?: {
    topLeft?: number;
    topRight?: number;
    bottomLeft?: number;
    bottomRight?: number;
  };
}

export const InputWithTokenSelect = ({
  type,
  estimated,
  borderRadius
}: InputWithTokenSelectProps) => {
  const { t } = useTranslation();

  const label = type === FIELD.TOKEN_A ? t('swap.pay') : t('swap.receive');

  const {
    selectedTokens,
    selectedTokensAmount,
    setLastChangedInput,
    isPoolsLoading,
    isExactInRef
  } = useSwapContextSelector();
  const { onChangeSelectedTokenAmount } = useSwapFieldsHandler();
  const {
    tokenToSell: { TOKEN: tokenA }
  } = useSwapTokens();
  const { onPresetAmountPress } = useSwapAmountPreset();

  const { bnBalanceAmount, isFetchingBalance } = useSwapBalance(
    selectedTokens[type]
  );

  const textInputRef = useRef<InputRef>(null);

  const [isBalanceLoading, setIsBalanceLoading] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [inputContainerWidth, setInputContainerWidth] = useState(0);

  const onChangeTokenAmount = (value: string) => {
    setLastChangedInput(type);
    let finalValue = StringUtils.formatNumberInput(value);
    finalValue = NumberUtils.limitDecimalCount(finalValue, 18);
    onChangeSelectedTokenAmount(type, finalValue);
  };

  const onToggleInputFocus = () => {
    setIsInputFocused((prev) => !prev);
  };

  const selection = useMemo(() => {
    if (!isInputFocused && selectedTokensAmount[type].length > 0) {
      return { start: 0, end: 0 };
    }
  }, [isInputFocused, selectedTokensAmount, type]);

  const value = useMemo(() => {
    const maxCharacterLimit = Math.floor(inputContainerWidth / 16);

    return StringUtils.wrapAndroidString(
      selectedTokensAmount[type],
      isInputFocused,
      maxCharacterLimit,
      true
    );
  }, [inputContainerWidth, isInputFocused, selectedTokensAmount, type]);

  const inputStyle = useMemo(() => {
    return Platform.select({
      android: { ...styles.input, ...styles.inputAndroidSpecified },
      ios: styles.input,
      default: styles.input
    });
  }, []);

  const onInputContainerPress = useCallback(() => {
    if (!isBalanceLoading) textInputRef.current?.focus();
  }, [isBalanceLoading]);

  const onLayoutEventHandle = useCallback(
    (event: LayoutChangeEvent) =>
      setInputContainerWidth(event.nativeEvent.layout.width),
    []
  );

  const disabled = useMemo(() => {
    return isPoolsLoading || isBalanceLoading;
  }, [isPoolsLoading, isBalanceLoading]);

  const transformedValue = useMemo(() => {
    const independentField = isExactInRef.current
      ? FIELD.TOKEN_A
      : FIELD.TOKEN_B;

    const parsedAmount = NumberUtils.toSignificantDigits(
      selectedTokensAmount[type],
      6
    );

    if (type === independentField) {
      return value;
    } else {
      return parsedAmount;
    }
  }, [isExactInRef, selectedTokensAmount, type, value]);

  const borderRadiusStyle = useMemo(() => {
    return {
      borderTopLeftRadius: borderRadius?.topLeft,
      borderTopRightRadius: borderRadius?.topRight,
      borderBottomLeftRadius: borderRadius?.bottomLeft,
      borderBottomRightRadius: borderRadius?.bottomRight
    };
  }, [borderRadius]);

  const onPresetAmountPressHandler = useCallback(
    async (value: (typeof BASE_PERCENTS_PRESET)[number]) =>
      await onPresetAmountPress({ type, bnBalanceAmount, value }),
    [onPresetAmountPress, type, bnBalanceAmount]
  );

  const paddingBottomStyle = useMemo(() => {
    return {
      paddingBottom: verticalScale(type === FIELD.TOKEN_A ? 32 : 16)
    };
  }, [type]);

  return (
    <View
      style={[
        styles.wrapper,
        borderRadiusStyle,
        paddingBottomStyle,
        paddingBottomStyle
      ]}
    >
      <RowContainer alignItems="center" justifyContent="space-between">
        <RowContainer alignItems="center" gap={4}>
          <Typography
            fontSize={14}
            fontFamily="Onest500Medium"
            color={COLORS.neutral800}
          >
            {label}
          </Typography>
          <Typography
            fontSize={14}
            fontFamily="Onest500Medium"
            color={COLORS.textSecondary}
          >
            {estimated && `(${t('swap.label.estimated')})`}
          </Typography>
        </RowContainer>
        <Balance
          type={type}
          bnBalanceAmount={bnBalanceAmount}
          isFetchingBalance={isFetchingBalance}
          setIsBalanceLoading={setIsBalanceLoading}
        />
      </RowContainer>
      <View style={styles.upperRow}>
        <TokenSelector type={type} />
        <Pressable
          onLayout={onLayoutEventHandle}
          onPress={onInputContainerPress}
          style={styles.inputContainer}
        >
          <TextInput
            focusable={!disabled}
            editable={!disabled}
            value={transformedValue}
            placeholder="0"
            type="number"
            numberOfLines={1}
            keyboardType="decimal-pad"
            onFocus={onToggleInputFocus}
            onBlur={onToggleInputFocus}
            selection={selection}
            onChangeText={onChangeTokenAmount}
            style={[
              inputStyle,
              {
                color:
                  COLORS[
                    type === FIELD.TOKEN_A ? 'textPrimary' : 'textSecondary'
                  ]
              }
            ]}
            textAlign="right"
          />
        </Pressable>
      </View>
      {type === FIELD.TOKEN_A && !!tokenA.address && (
        <>
          <Spacer value={verticalScale(16)} />
          <AmountPresetsContainer
            onPresetPress={
              onPresetAmountPressHandler as (payload: number) => void
            }
          />
        </>
      )}
    </View>
  );
};
