import { useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RowContainer, Spacer, Typography } from '@components/atoms';
import { TokenLogo } from '@components/molecules';
import { ArrowBottomFilledIcon } from '@components/svgs';
import { COLORS, FONT_SIZE } from '@constants';
import { useSwapContextSelector } from '@core/dex/context';
import { useSwapBottomSheetHandler } from '@core/dex/lib/hooks';
import { SelectedTokensKeys } from '@core/dex/types';
import { SwapStringUtils } from '@core/dex/utils';
import { getTokenNameFromDatabase, scale } from '@utils';
import { styles } from './styles';

interface TokenSelectorProps {
  readonly type: SelectedTokensKeys;
}

export const TokenSelector = ({ type }: TokenSelectorProps) => {
  const { t } = useTranslation();
  const { selectedTokens } = useSwapContextSelector();
  const { onShowBottomSheetByKey } = useSwapBottomSheetHandler();

  const isSelectedToken = useMemo(() => {
    return !!selectedTokens[type];
  }, [selectedTokens, type]);

  const tokenLogoHref = useMemo(
    () =>
      getTokenNameFromDatabase(selectedTokens[type].address) !== 'unknown'
        ? selectedTokens[type].symbol
        : selectedTokens[type].address,
    [selectedTokens, type]
  );

  const SAMBSupportedTokenLogo =
    SwapStringUtils.extendedLogoVariants(tokenLogoHref);

  const onToggleSelectTokenModal = useCallback(() => {
    onShowBottomSheetByKey(type);
  }, [onShowBottomSheetByKey, type]);

  return (
    <TouchableOpacity onPress={onToggleSelectTokenModal}>
      <View style={styles.currencySelector}>
        <RowContainer alignItems="center">
          {isSelectedToken && (
            <>
              <TokenLogo scale={0.75} token={SAMBSupportedTokenLogo ?? ''} />
              <Spacer horizontal value={scale(4)} />
            </>
          )}
          <Typography
            fontSize={FONT_SIZE.body.lg}
            fontFamily="Onest600SemiBold"
            color={COLORS.neutral800}
          >
            {isSelectedToken
              ? selectedTokens[type]?.symbol
              : t('swap.select.asset')}
          </Typography>
        </RowContainer>
        <Spacer horizontal value={scale(4)} />
        <ArrowBottomFilledIcon />
      </View>
    </TouchableOpacity>
  );
};
