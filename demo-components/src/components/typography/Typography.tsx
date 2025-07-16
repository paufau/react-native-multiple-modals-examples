import {useTheme} from '../../theme/colors';
import {FC} from 'react';
import {Text, TextProps} from 'react-native';

type TypographyProps = {
  color?: 'primary' | 'secondary';
} & TextProps;

export const Typography: FC<TypographyProps> = ({color, style, ...props}) => {
  const {colors} = useTheme();

  return (
    <Text
      style={[
        {
          color:
            color === 'secondary' ? colors.textSecondary : colors.textPrimary,
        },
        style,
      ]}
      {...props}
    />
  );
};
