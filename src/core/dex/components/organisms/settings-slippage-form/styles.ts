import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, FONTS } from '@constants';
import { verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    gap: verticalScale(16)
  },
  pressableContainer: {
    backgroundColor: COLORS.neutral100
  },
  input: {
    borderWidth: 1
  },
  typography: {
    fontSize: FONT_SIZE.body.sm,
    fontFamily: FONTS.Onest500Medium,
    color: COLORS.textPrimary
  },
  errorContainer: {
    maxWidth: '85%',
    marginTop: -verticalScale(8)
  }
});
