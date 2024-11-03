import {FC, useState} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {ModalView} from 'react-native-multiple-modals';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from '../../components/button/Button';
import {COLORS} from '../../theme/colors';

type BlockingModalProps = {
  onSubmit: () => void;
  onOpenAnother: () => void;
};

export const BlockingModal: FC<BlockingModalProps> = ({
  onSubmit,
  onOpenAnother,
}) => {
  const [isVisible, setVisibility] = useState(true);

  const hide = () => {
    setVisibility(false);
    setTimeout(onSubmit, 500);
  };

  return (
    <ModalView
      contentContainerStyle={styles.contentContainer}
      renderBackdrop={() =>
        isVisible ? (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.backdrop}
          />
        ) : null
      }>
      {isVisible ? (
        <SafeAreaView
          edges={Platform.select({android: ['bottom', 'top'], ios: []})}>
          <Animated.View
            entering={SlideInDown}
            exiting={SlideOutDown}
            style={styles.modal}>
            <Text style={styles.title}>Some Meaningful Title</Text>
            <View style={styles.buttons}>
              <Button onPress={hide}>Submit</Button>
              <Button onPress={onOpenAnother}>Open Animated</Button>
            </View>
          </Animated.View>
        </SafeAreaView>
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
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '500',
    color: COLORS.grayDark,
  },
  buttons: {
    marginTop: 32,
    gap: 16,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});
