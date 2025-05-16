import { SafeAreaView } from 'react-native-safe-area-context';
import { AppIcon } from '@components/svgs';
import { useSplashNavigation } from './hooks/use-splash-navigation';
import { styles } from './styles';

export const SplashScreen = () => {
  useSplashNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <AppIcon testID="splash_icon" />
    </SafeAreaView>
  );
};
