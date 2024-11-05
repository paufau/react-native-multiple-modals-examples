import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from './components/button/Button';
import {AnimatedModal} from './modals/animated/AnimatedModal';
import {BlockingModal} from './modals/blocking/BlockingModal';
import {BlurredModal} from './modals/blurred/BlurredModal';
import {RegularModal} from './modals/regular/RegularModal';
import {COLORS} from './theme/colors';
import {GesturedModal} from './modals/gestured/GesturedModal';

export const DemoScreen = () => {
  const [isRegularVisible, setRegularVisibility] = useState(false);
  const [isAnimatedVisible, setAnimatedVisibility] = useState(false);
  const [isBlockingVisible, setBlockingVisibility] = useState(false);
  const [isBlurredVisible, setBlurredVisibility] = useState(false);
  const [isGesturedVisible, setGesturedVisibility] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Button onPress={() => setRegularVisibility(true)}>Regular</Button>
        <Button onPress={() => setAnimatedVisibility(true)}>Animated</Button>
        <Button onPress={() => setBlockingVisibility(true)}>Blocking</Button>
        <Button onPress={() => setBlurredVisibility(true)}>Blurred</Button>
        <Button onPress={() => setGesturedVisibility(true)}>Gestured</Button>
      </View>

      {isRegularVisible && (
        <RegularModal onRequestDismiss={() => setRegularVisibility(false)} />
      )}
      {isAnimatedVisible && (
        <AnimatedModal onRequestDismiss={() => setAnimatedVisibility(false)} />
      )}
      {isBlockingVisible && (
        <BlockingModal
          onSubmit={() => setBlockingVisibility(false)}
          onOpenAnother={() => setAnimatedVisibility(true)}
        />
      )}
      {isBlurredVisible && (
        <BlurredModal onSubmit={() => setBlurredVisibility(false)} />
      )}
      {isGesturedVisible && (
        <GesturedModal onRequestDismiss={() => setGesturedVisibility(false)} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginHorizontal: 42,
  },
});
