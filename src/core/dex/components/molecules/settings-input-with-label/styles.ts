import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, FONTS } from '@constants';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 56,
    backgroundColor: COLORS.neutral100,
    position: 'relative',
    flexDirection: 'row',
    borderRadius: scale(16)
  },
  input: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
    backgroundColor: 'transparent',
    fontSize: FONT_SIZE.body.lg,
    fontFamily: FONTS.Onest500Medium,
    color: COLORS.textPrimary,
    paddingHorizontal: scale(16),
    borderRadius: scale(16)
  },
  label: {
    position: 'absolute',
    right: scale(16),
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 999
  }
});
