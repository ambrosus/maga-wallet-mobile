import { ReactNode, useMemo } from 'react';
import { View } from 'react-native';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { RowContainer, Typography } from '@components/atoms';
import { COLORS, Config, CryptoCurrencyCode, FONT_SIZE } from '@constants';
import { useSwapContextSelector } from '@core/dex/context';
import { useSwapInterface, useSwapTokens } from '@core/dex/lib/hooks';
import {
  addresses,
  SwapStringUtils,
  isETHtoWrapped,
  isWrappedToETH
} from '@core/dex/utils';
import { getObjectKeyByValue, NumberUtils } from '@utils';
import { styles } from './styles';

export const PreviewInformation = () => {
  const { t } = useTranslation();
  const {
    latestSelectedTokens,
    uiBottomSheetInformation,
    isMultiHopSwapBetterCurrency,
    estimatedGasValues
  } = useSwapContextSelector();

  const { priceImpactHighlight, isPriceImpactHigh } = useSwapInterface();

  const { tokensRoute } = useSwapTokens();

  const uiPriceImpact = useMemo(() => {
    const { priceImpact } = uiBottomSheetInformation;

    return priceImpact != null && priceImpact < 0.01 ? '<0.01' : priceImpact;
  }, [uiBottomSheetInformation]);

  const isMultiHopRoute = useMemo(() => {
    return isMultiHopSwapBetterCurrency.tokens.length > 0;
  }, [isMultiHopSwapBetterCurrency]);

  const tokens = useMemo(() => {
    return isMultiHopSwapBetterCurrency.tokens.map((token) =>
      getObjectKeyByValue(addresses, token)
    );
  }, [isMultiHopSwapBetterCurrency.tokens]);

  const renderHopTokensRoute = useMemo(() => {
    return tokens.length > 0 ? tokens.join(' > ') : '';
  }, [tokens]);

  const estimatedNetworkFee = useMemo(() => {
    const { swap, approval } = estimatedGasValues;

    const parsedEstimatedGas = ethers.utils.formatEther(swap.add(approval));

    return SwapStringUtils.transformRealizedLPFee(
      NumberUtils.limitDecimalCount(parsedEstimatedGas, 1)
    );
  }, [estimatedGasValues]);

  const isWrapOrUnwrapETH = useMemo(() => {
    return isETHtoWrapped(tokensRoute) || isWrappedToETH(tokensRoute);
  }, [tokensRoute]);

  return (
    <View style={styles.container}>
      <RowContainer alignItems="center" justifyContent="space-between">
        <Typography
          fontSize={15}
          fontFamily="Onest500Medium"
          color={COLORS.neutral500}
        >
          {t('common.network')}
        </Typography>

        <RightSideRowItem>{Config.CHAIN_ID}</RightSideRowItem>
      </RowContainer>

      <RowContainer alignItems="center" justifyContent="space-between">
        <Typography
          fontSize={FONT_SIZE.body.lg}
          fontFamily="Onest500Medium"
          color={COLORS.neutral500}
        >
          {t('common.network.fee')}
        </Typography>

        <RightSideRowItem>
          {`${estimatedNetworkFee} ${CryptoCurrencyCode.AMB} ~$1`}
        </RightSideRowItem>
      </RowContainer>

      {!isWrapOrUnwrapETH && (
        <RowContainer alignItems="center" justifyContent="space-between">
          <Typography
            fontSize={FONT_SIZE.body.lg}
            fontFamily="Onest500Medium"
            color={COLORS.neutral500}
          >
            {t('swap.review.price.impact')}
          </Typography>

          <RowContainer alignItems="center" gap={4}>
            <RightSideRowItem color={priceImpactHighlight}>
              {uiPriceImpact}%
            </RightSideRowItem>

            {isPriceImpactHigh && (
              <View style={styles.impactErrorContainer}>
                <Typography
                  fontSize={FONT_SIZE.body.sm}
                  fontFamily="Onest500Medium"
                  color={COLORS.destructive500}
                >
                  {t('swap.review.price.impact.error')}
                </Typography>
              </View>
            )}
          </RowContainer>
        </RowContainer>
      )}

      {isMultiHopRoute && (
        <RowContainer alignItems="center" justifyContent="space-between">
          <Typography
            fontSize={FONT_SIZE.body.lg}
            fontFamily="Onest500Medium"
            color={COLORS.neutral500}
          >
            {t('swap.review.route')}
          </Typography>

          <RightSideRowItem>
            {`${latestSelectedTokens.current.TOKEN_A?.symbol} > ${renderHopTokensRoute} > ${latestSelectedTokens.current.TOKEN_B?.symbol}`}
          </RightSideRowItem>
        </RowContainer>
      )}
    </View>
  );
};

const RightSideRowItem = ({
  children,
  fontSize = FONT_SIZE.body.md,
  color = COLORS.textPrimary
}: {
  children: ReactNode;
  fontSize?: number;
  color?: string;
}) => {
  return (
    <Typography fontSize={fontSize} fontFamily="Onest500Medium" color={color}>
      {children}
    </Typography>
  );
};
