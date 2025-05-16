import { StyleSheet } from 'react-native';
import { COLORS } from '@constants';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  // row: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   columnGap: scale(24)
  // },
  multiStepButton: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 48
  },
  approveButton: {
    borderWidth: 1,
    borderColor: COLORS.primary100,
    backgroundColor: COLORS.primary50
  },
  swapButton: {
    borderWidth: 1,
    borderColor: COLORS.primary400
  },
  button: {
    height: 48
  },
  pendingLayout: {
    columnGap: scale(8)
  }
});
