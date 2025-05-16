import { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FLEX_FULL_SIZE } from '@constants';

export const SafeContainerProvider = ({ children }: PropsWithChildren) => (
  <SafeAreaProvider style={FLEX_FULL_SIZE}>{children}</SafeAreaProvider>
);
