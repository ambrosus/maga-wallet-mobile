import { forwardRef, useCallback } from 'react';
import { ListRenderItemInfo, Platform } from 'react-native';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { toLower } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Spacer } from '@components/atoms';
import { BottomSheet } from '@components/organisms';
import { bnZERO, DEVICE_HEIGHT } from '@constants';
import { BottomSheetTokenItem } from '@core/dex/components/organisms';
import { useSwapAllBalances } from '@core/dex/lib/hooks';
import { SelectedTokensKeys, SwapToken } from '@core/dex/types';
import { transformTokensObject } from '@core/dex/utils';
import { useForwardedRef, useSafeViewController } from '@lib';
import { useRodeoTokensListQuery } from '@lib/hooks/queries';
import { scale } from '@utils';

interface BottomSheetTokensListProps {
  type: SelectedTokensKeys;
}

export const BottomSheetTokensList = forwardRef<
  BottomSheetModal,
  BottomSheetTokensListProps
>(({ type }, ref) => {
  const { t } = useTranslation();
  const bottomSheetRef = useForwardedRef(ref);
  const { balances } = useSwapAllBalances();

  const { tokens } = useRodeoTokensListQuery();

  const label = t(`swap.bottom.sheet.select.${toLower(type)}`);

  const { bottom } = useSafeViewController();

  const renderListCurrencyItem = useCallback(
    ({ item }: ListRenderItemInfo<SwapToken>) => {
      const { address } = item;

      const balanceEntry = balances.find(
        (balance) => Object.keys(balance)[0] === address
      );

      return (
        <BottomSheetTokenItem
          token={item}
          bnBalance={balanceEntry?.[address] ?? bnZERO}
          type={type}
        />
      );
    },
    [balances, type]
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      title={label}
      maxDynamicContentSize={DEVICE_HEIGHT / 2}
    >
      <Spacer value={scale(16)} />

      <BottomSheetFlatList
        maxToRenderPerBatch={4}
        data={transformTokensObject(tokens)}
        showsVerticalScrollIndicator={false}
        style={{
          marginBottom: Platform.select({
            ios: bottom,
            android: bottom * 2
          })
        }}
        keyExtractor={(item) => item.symbol}
        renderItem={renderListCurrencyItem}
      />

      <Spacer value={scale(bottom === 0 ? 20 : bottom)} />
    </BottomSheet>
  );
});
