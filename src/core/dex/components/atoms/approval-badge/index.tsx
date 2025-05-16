import { useMemo, useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor
} from 'react-native-reanimated';
import { RowContainer, Typography } from '@components/atoms';
import { COLORS, FONT_SIZE } from '@constants';
import { useSwapContextSelector } from '@core/dex/context';
import { AllowanceStatus } from '@core/dex/types';
import { useSafeViewController } from '@lib';
import { styles } from './styles';

export const ApprovalBadge = () => {
  const { bottom } = useSafeViewController();
  const { uiBottomSheetInformation } = useSwapContextSelector();

  const approved = useMemo(
    () => uiBottomSheetInformation.allowance === AllowanceStatus.INCREASED,
    [uiBottomSheetInformation.allowance]
  );

  const animationProgress = useSharedValue(0);

  useEffect(() => {
    animationProgress.value = withTiming(approved ? 1 : 0, { duration: 500 });
  }, [approved, animationProgress]);

  const circleAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animationProgress.value,
      [0, 1],
      [COLORS.primary50, COLORS.success500]
    );

    return {
      backgroundColor
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      animationProgress.value,
      [0, 1],
      [COLORS.primary500, COLORS.white]
    );

    return {
      color
    };
  });

  return (
    <RowContainer
      width="50%"
      alignItems="center"
      justifyContent="center"
      style={{ ...styles.container, marginTop: -bottom }}
    >
      <Animated.View style={[styles.circle, circleAnimatedStyle]}>
        <Animated.Text
          style={[
            {
              fontSize: FONT_SIZE.body.sm,
              fontFamily: 'Onest500Medium'
            },
            textAnimatedStyle
          ]}
        >
          1
        </Animated.Text>
      </Animated.View>
      <View style={styles.divider} />
      <View style={styles.circle}>
        <Typography
          fontSize={FONT_SIZE.body.sm}
          fontFamily="Onest500Medium"
          color={COLORS.primary500}
        >
          2
        </Typography>
      </View>
    </RowContainer>
  );
};
