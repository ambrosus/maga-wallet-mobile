import { StyleSheet } from 'react-native';
import { COLORS } from '@constants';

export const styles = StyleSheet.create({
  container: {
    alignSelf: 'center'
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: Number.MAX_SAFE_INTEGER,
    backgroundColor: COLORS.primary50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  divider: {
    width: '100%',
    height: 2,
    backgroundColor: COLORS.primary50
  }
});
