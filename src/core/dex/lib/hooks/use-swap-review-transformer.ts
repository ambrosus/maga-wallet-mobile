import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSwapContextSelector } from '@core/dex/context';
import { FIELD, SelectedTokensKeys } from '@core/dex/types';

export const useSwapReviewTransformer = (type: SelectedTokensKeys) => {
  const { t } = useTranslation();
  const { uiBottomSheetInformation, selectedTokensAmount, _refExactGetter } =
    useSwapContextSelector();

  const label = useMemo(() => {
    if (type === FIELD.TOKEN_A) {
      return t(_refExactGetter ? 'swap.pay' : 'swap.review.maximum.sold');
    }

    return t(
      !_refExactGetter ? 'swap.receive' : 'swap.review.minimum.received'
    );
  }, [_refExactGetter, t, type]);

  const amount = useMemo(() => {
    const { minimumReceivedAmount } = uiBottomSheetInformation;
    const defaultValue = selectedTokensAmount[type];

    if (type === FIELD.TOKEN_A) {
      return _refExactGetter ? defaultValue : minimumReceivedAmount ?? '';
    }

    return !_refExactGetter ? defaultValue : minimumReceivedAmount ?? '';
  }, [_refExactGetter, selectedTokensAmount, type, uiBottomSheetInformation]);

  return { label, amount };
};
