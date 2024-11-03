import {FC, ReactNode} from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import {COLORS} from '../../theme/colors';

type ButtonProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  children: string | ReactNode;
};

export const Button: FC<ButtonProps> = ({children, ...props}) => {
  return (
    <Pressable
      {...props}
      style={({pressed}) => [
        styles.button,
        props.style,
        pressed && styles.buttonPressed,
      ]}>
      {typeof children === 'string' ? (
        <Text style={styles.title}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderCurve: 'continuous',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.buttons.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  buttonPressed: {
    opacity: 0.2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.background,
  },
});
