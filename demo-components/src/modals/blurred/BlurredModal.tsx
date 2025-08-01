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
import {BaseModalProps} from '../BaseModal';

type BlurredModalProps = BaseModalProps;

const AnimatedBlur = Animated.createAnimatedComponent(BlurView);

export const BlurredModal: FC<BlurredModalProps> = ({
  onRequestDismiss,
  testID,
  title,
}) => {
  const [isVisible, setVisibility] = useState(true);

  const hide = () => {
    setVisibility(false);
    setTimeout(onRequestDismiss, 500);
  };

  return (
    <ModalView
      contentContainerStyle={styles.contentContainer}
      onRequestDismiss={hide}
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
          testID={`${testID}-modal`}
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <Button testID={`${testID}-close-button`} onPress={hide}>
            Close
          </Button>
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
