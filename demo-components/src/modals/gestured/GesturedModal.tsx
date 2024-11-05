import {FC} from 'react';
import {StyleSheet, Text} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {ModalView} from 'react-native-multiple-modals';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Button} from '../../components/button/Button';
import {COLORS} from '../../theme/colors';

type GesturedModalProps = {
  onRequestDismiss: () => void;
};

export const GesturedModal: FC<GesturedModalProps> = ({onRequestDismiss}) => {
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
        <Animated.View style={[styles.modal, animatedModalStyle]}>
          <Text style={styles.title}>Drag The Modal</Text>
          <Text style={styles.description}>
            The modal view should be draggable.
          </Text>
          <Button style={styles.closeButton} onPress={onRequestDismiss}>
            Close
          </Button>
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
  modal: {
    width: '80%',
    borderRadius: 26,
    backgroundColor: COLORS.while,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    padding: 20,
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
  closeButton: {
    marginTop: 16,
  },
});
