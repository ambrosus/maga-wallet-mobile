import { StyleSheet } from 'react-native';
import { COLORS } from '@constants';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: scale(16),
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  background: {
    ...StyleSheet.absoluteFillObject
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  successContainer: {
    alignItems: 'center'
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.textPrimary
  }
});
