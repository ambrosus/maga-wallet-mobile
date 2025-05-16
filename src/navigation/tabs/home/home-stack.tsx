import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DEXScreen } from '@screens';
import {
  DexReviewSwapScreen,
  DexSettingsScreen,
  DexSuccessScreen
} from '@screens/dex/screens';
import { HomeScreen } from '@screens/home';
import { HOME_STACK_ROUTES, HomeTabParamsList } from './types';

export const HomeStack = () => {
  const Stack = createNativeStackNavigator<HomeTabParamsList>();

  return (
    <>
      <Stack.Navigator
        initialRouteName={HOME_STACK_ROUTES.HomeScreen}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name={HOME_STACK_ROUTES.HomeScreen}
          component={HomeScreen}
        />
        <Stack.Group>
          <Stack.Screen
            name={HOME_STACK_ROUTES.DEXScreen}
            component={DEXScreen}
            options={{
              animation: 'slide_from_bottom'
            }}
          />
          <Stack.Screen
            name={HOME_STACK_ROUTES.DexReviewSwapScreen}
            component={DexReviewSwapScreen}
          />
          <Stack.Screen
            name={HOME_STACK_ROUTES.DexSettingsScreen}
            component={DexSettingsScreen}
          />
          <Stack.Screen
            name={HOME_STACK_ROUTES.DexSuccessScreen}
            component={DexSuccessScreen}
          />
        </Stack.Group>
      </Stack.Navigator>
    </>
  );
};

export default HomeStack;
