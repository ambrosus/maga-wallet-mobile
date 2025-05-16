import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toast } from '@components/molecules';
import { FLEX_FULL_SIZE } from '@constants';
import { SwapContextProvider } from '@core/dex/context';
import { ApolloClientProvider } from './apollo-client';
import { LocalizationProvider } from './localization';
import { NavigationProvider } from './navigation';
import { SafeContainerProvider } from './safe-area';

export const WrappedAppWithProviders = () => {
  return (
    <GestureHandlerRootView style={FLEX_FULL_SIZE}>
      <SafeContainerProvider>
        <LocalizationProvider>
          <ApolloClientProvider>
            <SwapContextProvider>
              <BottomSheetModalProvider>
                <NavigationProvider />
                <Toast />
              </BottomSheetModalProvider>
            </SwapContextProvider>
          </ApolloClientProvider>
        </LocalizationProvider>
      </SafeContainerProvider>
    </GestureHandlerRootView>
  );
};
