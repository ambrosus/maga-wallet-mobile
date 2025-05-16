import { memo, useEffect, useMemo, useState, useRef } from 'react';
import { View } from 'react-native';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { RowContainer, Spinner, Typography } from '@components/atoms';
import { TokenLogo } from '@components/molecules';
import { COLORS, FONT_SIZE } from '@constants';
import { useSwapContextSelector } from '@core/dex/context';
import { useSwapBetterRate } from '@core/dex/lib/hooks';
import {
  minimumAmountOut,
  maximumAmountIn,
  SwapStringUtils,
  addresses
} from '@core/dex/utils';
import { getObjectKeyByValue, NumberUtils } from '@utils';
import { styles } from './styles';

interface SwapTradeDetailsProps {
  tokenToSell: string;
  tokenToReceive: string;
  tokensRoute: string[];
}

export const SwapTradeDetails = memo(
  ({ tokenToSell, tokenToReceive }: SwapTradeDetailsProps) => {
    const { t } = useTranslation();
    const { isExecutingPrice } = useSwapContextSelector();
    const {
      latestSelectedTokens,
      selectedTokensAmount,
      _refSettingsGetter,
      _refExactGetter,
      isMultiHopSwapBetterCurrency
    } = useSwapContextSelector();
    const {
      bestSwapRate,

      tokens,
      isExecutingRate,
      rate,
      setRate
    } = useSwapBetterRate();

    const [minOrMaxReceived, setMinOrMaxReceived] = useState({
      label: t(''),
      symbol: '',
      value: ''
    });

    const prevMiddleHopTokensRef = useRef<string[]>([]);

    useEffect(() => {
      const timeout = setTimeout(() => {
        if (tokenToSell && tokenToReceive && !isExecutingPrice) {
          const executedTokensRate = bestSwapRate();

          if (!!executedTokensRate) {
            setRate(executedTokensRate);
          }
        }
      }, 1000);

      return () => clearTimeout(timeout);
    }, [bestSwapRate, tokenToReceive, tokenToSell, isExecutingPrice, setRate]);

    const transformedCurrencyRate = useMemo(
      () => NumberUtils.toSignificantDigits(rate.toString(), 6),
      [rate]
    );

    useEffect(() => {
      const timeout = setTimeout(() => {
        if (tokenToSell && tokenToReceive && !isExecutingPrice) {
          const bnMinimumReceivedAmount = minimumAmountOut(
            `${_refSettingsGetter.slippageTolerance}%`,
            ethers.utils.parseEther(
              _refExactGetter
                ? selectedTokensAmount.TOKEN_B
                : selectedTokensAmount.TOKEN_A
            )
          );

          const bnMaximumReceivedAmount = maximumAmountIn(
            `${_refSettingsGetter.slippageTolerance}%`,
            ethers.utils.parseEther(
              _refExactGetter
                ? selectedTokensAmount.TOKEN_B
                : selectedTokensAmount.TOKEN_A
            )
          );

          const receivedAmountOut = SwapStringUtils.transformMinAmountValue(
            bnMinimumReceivedAmount
          );

          const receivedMaxAmountOut = SwapStringUtils.transformMinAmountValue(
            bnMaximumReceivedAmount
          );

          setMinOrMaxReceived({
            label: t(
              !_refExactGetter
                ? 'swap.review.maximum.sold'
                : 'swap.review.minimum.received'
            ),
            symbol: _refExactGetter ? tokens.symbolInput : tokens.symbolOutput,
            value: !_refExactGetter ? receivedMaxAmountOut : receivedAmountOut
          });
        }
      }, 1000);

      return () => clearTimeout(timeout);
    }, [
      _refExactGetter,
      _refSettingsGetter.slippageTolerance,
      isExecutingPrice,
      selectedTokensAmount.TOKEN_A,
      selectedTokensAmount.TOKEN_B,
      t,
      tokenToReceive,
      tokenToSell,
      tokens.symbolInput,
      tokens.symbolOutput
    ]);

    const middleHopTokens = useMemo(() => {
      const tokens = isMultiHopSwapBetterCurrency.tokens
        .map((token) => getObjectKeyByValue(addresses, token))
        .filter((token): token is string => token !== undefined);

      if (tokens.length === 0 && prevMiddleHopTokensRef.current.length > 0) {
        return prevMiddleHopTokensRef.current;
      }

      if (tokens.length > 0) {
        prevMiddleHopTokensRef.current = tokens;
      }

      return tokens.length > 0 ? tokens : prevMiddleHopTokensRef.current;
    }, [isMultiHopSwapBetterCurrency.tokens]);

    const renderHopTokensRoute = useMemo(() => {
      return middleHopTokens.length > 0 ? middleHopTokens.join(' > ') : '';
    }, [middleHopTokens]);

    const shouldShowRoute = useMemo(() => {
      return prevMiddleHopTokensRef.current.length > 0;
    }, []);

    return (
      <View style={styles.container}>
        {isExecutingRate || typeof rate === 'number' ? (
          <Spinner customSize={17.5} />
        ) : (
          <View style={styles.innerContainer}>
            <RowContainer alignItems="center" justifyContent="space-between">
              <Typography
                fontSize={FONT_SIZE.body.sm}
                fontFamily="Onest500Medium"
                color={COLORS.neutral500}
              >
                {minOrMaxReceived.label}
              </Typography>
              <RowContainer alignItems="center" gap={4}>
                <TokenLogo scale={0.5} token={minOrMaxReceived.symbol} />
                <Typography
                  fontSize={FONT_SIZE.body.sm}
                  fontFamily="Onest500Medium"
                  color={COLORS.textPrimary}
                >
                  {minOrMaxReceived.value}
                </Typography>
              </RowContainer>
            </RowContainer>

            <RowContainer alignItems="center" justifyContent="space-between">
              <Typography
                fontSize={FONT_SIZE.body.sm}
                fontFamily="Onest500Medium"
                color={COLORS.neutral500}
              >
                {t('swap.review.rate')}
              </Typography>
              <Typography
                fontSize={FONT_SIZE.body.sm}
                fontFamily="Onest500Medium"
                color={COLORS.neutral500}
              >
                1 {tokens.symbolInput ?? 'AMB'} = {transformedCurrencyRate}{' '}
                {tokens.symbolOutput}
              </Typography>
            </RowContainer>

            {shouldShowRoute && (
              <RowContainer alignItems="center" justifyContent="space-between">
                <Typography
                  fontSize={FONT_SIZE.body.sm}
                  fontFamily="Onest500Medium"
                  color={COLORS.neutral500}
                >
                  {t('swap.review.route')}
                </Typography>

                <Typography
                  fontSize={FONT_SIZE.body.sm}
                  fontFamily="Onest500Medium"
                  color={COLORS.neutral500}
                >
                  {`${latestSelectedTokens.current.TOKEN_A?.symbol} > ${renderHopTokensRoute} > ${latestSelectedTokens.current.TOKEN_B?.symbol}`}
                </Typography>
              </RowContainer>
            )}
          </View>
        )}
      </View>
    );
  },
  (prevProps, nextProps) =>
    prevProps.tokenToReceive === nextProps.tokenToReceive &&
    prevProps.tokenToSell === nextProps.tokenToSell
);
