import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(16)
  },
  innerContainer: {
    rowGap: 12,
    paddingHorizontal: scale(16)
  }
});
