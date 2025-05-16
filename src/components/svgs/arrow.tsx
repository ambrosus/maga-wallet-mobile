import Svg, { Path } from 'react-native-svg';
import { ArrowOrientation, ArrowPosition, COLORS } from '@constants';
import { SvgIconProps } from '@types';

interface ArrowProps extends SvgIconProps {
  orientation?: ArrowOrientation;
}

export const Arrow = ({
  scale = 1,
  color = COLORS.black,
  orientation = 'right'
}: ArrowProps) => {
  const width = 8 * scale;
  const height = 14 * scale;

  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      style={{ transform: [{ rotate: `${ArrowPosition[orientation]}deg` }] }}
    >
      <Path
        fill={color}
        d="m2.828 7 4.95 4.95-1.414 1.415L0 7 6.364.637 7.778 2.05 2.828 7Z"
      />
    </Svg>
  );
};
