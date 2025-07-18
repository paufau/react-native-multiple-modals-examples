import {FC} from 'react';
import {StyleSheet} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {ModalView} from 'react-native-multiple-modals';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {AlertContent} from '../../components/alert-content/AlertContent';

type GesturedModalProps = {
  onRequestDismiss: () => void;
  testID: string;
};

export const GesturedModal: FC<GesturedModalProps> = ({
  onRequestDismiss,
  testID,
}) => {
  const translation = useSharedValue({x: 0, y: 0});

  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      translation.value = {
        x: e.translationX,
        y: e.translationY,
      };
    })
    .onEnd(() => {
      const duration = 200;

      translation.value = {
        x: withTiming(0, {duration}),
        y: withTiming(0, {duration}),
      };
    });

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: translation.value.x},
      {translateY: translation.value.y},
    ],
  }));

  return (
    <ModalView
      onRequestDismiss={onRequestDismiss}
      contentContainerStyle={styles.contentContainer}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedModalStyle}>
          <AlertContent onRequestDismiss={onRequestDismiss} testID={testID} />
        </Animated.View>
      </GestureDetector>
    </ModalView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
