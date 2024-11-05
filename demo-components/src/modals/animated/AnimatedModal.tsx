import {FC, useState} from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {ModalView} from 'react-native-multiple-modals';
import Animated, {FadeIn, FadeOut, withTiming} from 'react-native-reanimated';
import {Button} from '../../components/button/Button';
import {COLORS} from '../../theme/colors';

type AnimatedModalProps = {
  onRequestDismiss: () => void;
};

const ZoomAndFadeIn = () => {
  'worklet';
  const duration = 300;

  const animations = {
    opacity: withTiming(1, {duration}),
    transform: [{scale: withTiming(1, {duration})}],
  };
  const initialValues = {
    opacity: 0,
    transform: [{scale: 0.3}],
  };
  return {
    animations,
    initialValues,
  };
};

const ZoomAndFadeOut = () => {
  'worklet';
  const duration = 300;

  const animations = {
    opacity: withTiming(0, {duration}),
    transform: [{scale: withTiming(0.3, {duration})}],
  };
  const initialValues = {
    opacity: 1,
    transform: [{scale: 1}],
  };
  return {
    animations,
    initialValues,
  };
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const AnimatedModal: FC<AnimatedModalProps> = ({onRequestDismiss}) => {
  const [isContentVisible, setContentVisibility] = useState(true);

  const hide = () => {
    setContentVisibility(false);
    setTimeout(() => {
      onRequestDismiss();
    }, 300);
  };

  return (
    <ModalView
      onRequestDismiss={hide}
      contentContainerStyle={styles.contentContainer}
      renderBackdrop={() =>
        isContentVisible && (
          <AnimatedPressable
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.backdrop}
            onPress={hide}
          />
        )
      }>
      {isContentVisible && (
        <Animated.View
          entering={ZoomAndFadeIn}
          exiting={ZoomAndFadeOut}
          style={styles.modal}>
          <Text style={styles.title}>Request Confirmation</Text>
          <Text style={styles.description}>
            We will process your request and contact you as soon as possible.
          </Text>
          {/*  */}
          <Button style={styles.confirmButton} onPress={hide}>
            Confirm
          </Button>
        </Animated.View>
      )}
    </ModalView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: '80%',
    borderRadius: 26,
    backgroundColor: COLORS.while,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    padding: 20,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  title: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '500',
    color: COLORS.grayDark,
  },
  description: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '400',
    color: COLORS.grayDark,
    marginTop: 8,
  },
  confirmButton: {
    marginTop: 16,
  },
});
