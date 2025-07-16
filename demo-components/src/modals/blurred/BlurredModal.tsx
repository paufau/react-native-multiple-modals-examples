import {BlurView} from '@react-native-community/blur';
import {FC, useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {ModalView} from 'react-native-multiple-modals';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import {Button} from '../../components/button/Button';
import {COLORS} from '../../theme/colors';

type BlurredModalProps = {
  onRequestDismiss: () => void;
};

const AnimatedBlur = Animated.createAnimatedComponent(BlurView);

export const BlurredModal: FC<BlurredModalProps> = ({onRequestDismiss}) => {
  const [isVisible, setVisibility] = useState(true);

  const hide = () => {
    setVisibility(false);
    setTimeout(onRequestDismiss, 500);
  };

  return (
    <ModalView
      contentContainerStyle={styles.contentContainer}
      renderBackdrop={() =>
        isVisible ? (
          <AnimatedBlur
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.backdrop}
          />
        ) : null
      }>
      {isVisible ? (
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={styles.modal}>
          <Text style={styles.title}>This is the blurred modal</Text>
          <Button onPress={hide}>Submit</Button>
        </Animated.View>
      ) : null}
    </ModalView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: 'flex-end',
  },
  modal: {
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    minHeight: 300,
    backgroundColor: COLORS.while,
    alignItems: 'stretch',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 30,
    color: COLORS.grayDark,
  },
  backdrop: {
    flex: 1,
  },
});
