import { useMemo } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { KeyboardDismissingView, Spacer } from '@components/atoms';
import { FLEX_FULL_SIZE, isIos } from '@constants';
import { SwapReverseTokens } from '@core/dex/components/molecules';
import {
  InputWithTokenSelect,
  SwapTradeDetails,
  ReviewSwapButton
} from '@core/dex/components/organisms';
import { useSwapContextSelector } from '@core/dex/context';
import { useSwapInterface, useSwapTokens } from '@core/dex/lib/hooks';
import { FIELD } from '@core/dex/types';
import { tradeDetailsVisibility } from '@core/dex/utils';
import { scale } from '@utils';
import { styles } from './styles';

const KEYBOARD_BEHAVIOR = isIos ? 'padding' : 'height';

export const SwapForm = () => {
  const { isEstimatedToken } = useSwapInterface();
  const { selectedTokens, selectedTokensAmount } = useSwapContextSelector();
  const { tokensRoute } = useSwapTokens();

  const tokenToSell = useMemo(
    () => ({
      TOKEN: selectedTokens.TOKEN_A,
      AMOUNT: selectedTokensAmount.TOKEN_A
    }),
    [selectedTokens.TOKEN_A, selectedTokensAmount.TOKEN_A]
  );

  const tokenToReceive = useMemo(
    () => ({
      TOKEN: selectedTokens.TOKEN_B,
      AMOUNT: selectedTokensAmount.TOKEN_B
    }),
    [selectedTokens.TOKEN_B, selectedTokensAmount.TOKEN_B]
  );

  const isSwapTradeDetailsVisible = useMemo(() => {
    return tradeDetailsVisibility(
      tokenToSell.TOKEN,
      tokenToSell.AMOUNT,
      tokenToReceive.TOKEN,
      tokenToReceive.AMOUNT
    );
  }, [tokenToReceive, tokenToSell]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      keyboardVerticalOffset={isIos ? 20 : 0}
      behavior={KEYBOARD_BEHAVIOR}
    >
      <KeyboardAvoidingView style={FLEX_FULL_SIZE}>
        <KeyboardDismissingView style={FLEX_FULL_SIZE}>
          <View style={styles.innerContainer}>
            <View style={styles.relativeContainer}>
              <Spacer value={scale(22)} />
              <InputWithTokenSelect
                type={FIELD.TOKEN_A}
                estimated={isEstimatedToken.tokenA}
                borderRadius={{
                  topLeft: 16,
                  topRight: 16
                }}
              />
              <SwapReverseTokens />
              <InputWithTokenSelect
                type={FIELD.TOKEN_B}
                estimated={isEstimatedToken.tokenB}
                borderRadius={{
                  bottomLeft: 16,
                  bottomRight: 16
                }}
              />
            </View>

            <Spacer value={scale(24)} />

            {isSwapTradeDetailsVisible && (
              <SwapTradeDetails
                tokenToSell={tokenToSell.TOKEN.address}
                tokenToReceive={tokenToReceive.TOKEN.address}
                tokensRoute={tokensRoute}
              />
            )}
          </View>

          <View style={styles.footer}>
            <ReviewSwapButton />
          </View>
        </KeyboardDismissingView>
      </KeyboardAvoidingView>
    </KeyboardAvoidingView>
  );
};
