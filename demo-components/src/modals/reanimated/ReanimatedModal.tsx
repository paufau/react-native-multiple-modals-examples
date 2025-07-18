import {FC} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {ModalView} from 'react-native-multiple-modals';
import Animated, {FadeIn, FadeOut, withTiming} from 'react-native-reanimated';
import {AlertContent} from '../../components/alert-content/AlertContent';

type ReanimatedModalProps = {
  onRequestDismiss: () => void;
  testID: string;
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

export const ReanimatedModal: FC<ReanimatedModalProps> = ({
  onRequestDismiss,
  testID,
}) => {
  return (
    <ModalView
      onRequestDismiss={onRequestDismiss}
      contentContainerStyle={styles.contentContainer}
      renderBackdrop={() => (
        <AnimatedPressable
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.backdrop}
          onPress={onRequestDismiss}
        />
      )}>
      <Animated.View entering={ZoomAndFadeIn} exiting={ZoomAndFadeOut}>
        <AlertContent onRequestDismiss={onRequestDismiss} testID={testID} />
      </Animated.View>
    </ModalView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});
