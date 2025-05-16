import { StyleSheet } from 'react-native';
import { COLORS } from '@constants';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: verticalScale(24),
    rowGap: verticalScale(16)
  },
  impactErrorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    backgroundColor: COLORS.destructive50
  }
});
