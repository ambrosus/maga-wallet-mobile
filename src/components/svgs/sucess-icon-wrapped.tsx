import Svg, { Circle, Path } from 'react-native-svg';
import { SvgIconProps } from '@types';

export const SuccessIconWrapped = ({ scale = 1 }: SvgIconProps) => {
  const size = 130 * scale;

  return (
    <Svg width={size} height={size} fill="none" viewBox="0 0 133 133">
      <Circle cx="66.5" cy="66.5" r="64.125" fill="#BBF7D0" />
      <Circle cx="66.5" cy="66.5" r="44.333" fill="#DCFCE7" />
      <Path
        fill="#16A34A"
        d="M66.5 98.167c17.489 0 31.667-14.178 31.667-31.667S83.989 34.834 66.5 34.834 34.833 49.01 34.833 66.5 49.011 98.167 66.5 98.167m17.28-39.72L63.334 78.896 50.011 65.573l4.478-4.479 8.844 8.845 15.97-15.97z"
      ></Path>
    </Svg>
  );
};
