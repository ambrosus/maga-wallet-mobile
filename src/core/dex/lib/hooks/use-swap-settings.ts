import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSwapContextSelector } from '@core/dex/context';
import { Settings, SettingsKeys } from '@core/dex/types';
import { StringUtils, NumberUtils } from '@utils';

export function useSwapSettings() {
  const { setSettings, _refSettingsGetter } = useSwapContextSelector();
  const [localSettingsState, setLocalSettingsState] =
    useState<Settings>(_refSettingsGetter);

  const settings = useRef<Settings>(_refSettingsGetter);

  useEffect(() => {
    settings.current = _refSettingsGetter;
  }, [_refSettingsGetter]);

  const onChangeDeadlineHandle = useCallback((payload: string) => {
    if (/^0$|[.,]/.test(payload)) return;

    setLocalSettingsState((prevState) => ({
      ...prevState,
      deadline: StringUtils.formatNumberInput(payload)
    }));
  }, []);

  const onChangeSlippageToleranceHandle = useCallback((payload: string) => {
    const DECIMALS = 2;
    const formattedValue = StringUtils.formatNumberInput(payload);

    setLocalSettingsState((prevState) => ({
      ...prevState,
      slippageTolerance: NumberUtils.limitDecimalCount(formattedValue, DECIMALS)
    }));
  }, []);

  const onApplySettingsHandle = useCallback(() => {
    setSettings(localSettingsState);
  }, [localSettingsState, setSettings]);

  const onChangeSettings = useCallback(
    (key: SettingsKeys, value: string | boolean) => {
      switch (key) {
        case 'deadline':
          return onChangeDeadlineHandle(value as string);
        case 'slippageTolerance':
          return onChangeSlippageToleranceHandle(value as string);
        default:
          return setLocalSettingsState((prevState) => ({
            ...prevState,
            [key]: value
          }));
      }
    },
    [onChangeDeadlineHandle, onChangeSlippageToleranceHandle]
  );

  const isAutoApprovalEnabled = useMemo(
    () => _refSettingsGetter.autoApproval,
    [_refSettingsGetter.autoApproval]
  );

  return {
    localSettingsState,
    onChangeSettings,
    onApplySettingsHandle,
    settings,
    _refSettingsGetter,
    isAutoApprovalEnabled
  };
}
