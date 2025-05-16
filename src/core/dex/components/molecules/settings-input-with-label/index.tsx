import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  View
} from 'react-native';
import { Spacer, Typography } from '@components/atoms';
import { COLORS, FONT_SIZE } from '@constants';
import { verticalScale } from '@utils';
import { styles } from './styles';

interface SettingsInputWithLabelProps
  extends Pick<TextInputProps, 'value' | 'onChangeText' | 'onBlur'> {
  heading: string;
  label: string;
  placeholder?: string;
  inputStyle?: StyleProp<TextStyle>;
}

export const SettingsInputWithLabel = ({
  heading,
  label,
  placeholder,
  inputStyle,
  ...restProps
}: SettingsInputWithLabelProps) => {
  return (
    <View>
      <Typography
        fontSize={FONT_SIZE.body.md}
        fontFamily="Onest500Medium"
        color={COLORS.textPrimary}
      >
        {heading}
      </Typography>

      <Spacer value={verticalScale(16)} />

      <View style={styles.container}>
        <TextInput
          maxLength={24}
          style={[styles.input, inputStyle]}
          keyboardType="numeric"
          placeholder={placeholder}
          placeholderTextColor={COLORS.textSecondary}
          {...restProps}
        />

        <View style={styles.label}>
          <Typography
            fontSize={FONT_SIZE.default}
            fontFamily="Onest500Medium"
            color={COLORS.textSecondary}
          >
            {label}
          </Typography>
        </View>
      </View>
    </View>
  );
};
