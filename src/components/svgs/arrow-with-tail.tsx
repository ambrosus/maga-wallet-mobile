import Svg, { Path } from 'react-native-svg';
import { ArrowOrientation, COLORS } from '@constants';
import { SvgIconProps } from '@types';

interface ArrowWithTailProps extends SvgIconProps {
  orientation?: ArrowOrientation;
}

export const ArrowWithTail = ({
  scale = 1,
  color = COLORS.primary400,
  orientation = 'down'
}: ArrowWithTailProps) => {
  const size = 20 * scale;

  const rotationAngles = {
    down: 0,
    up: 180,
    left: 90,
    right: 270
  } as const;

  const rotationAngle = rotationAngles[orientation] || 0;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      style={{ transform: [{ rotate: `${rotationAngle}deg` }] }}
    >
      <Path
        d="M10.8335 13.4765L15.3035 9.0065L16.482 10.185L10.0001 16.6668L3.51831 10.185L4.69683 9.0065L9.16679 13.4765V3.3335H10.8335V13.4765Z"
        fill={color}
      />
    </Svg>
  );
};
