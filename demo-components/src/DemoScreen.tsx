import {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from './components/button/Button';
import {AnimatedModal} from './modals/animated/AnimatedModal';
import {BlockingModal} from './modals/blocking/BlockingModal';
import {BlurredModal} from './modals/blurred/BlurredModal';
import {GesturedModal} from './modals/gestured/GesturedModal';
import {InBottomTabsModal} from './modals/in-bottom-tabs-modal/InBottomTabsModal';
import {ReanimatedModal} from './modals/reanimated/ReanimatedModal';
import {RegularModal} from './modals/regular/RegularModal';
import {COLORS} from './theme/colors';
import {FullScreenNoBackgroundModal} from './modals/full-screen-no-bg/FullScreenNoBackgroundModal';

export const DemoScreen = () => {
  useEffect(() => {
    console.info('==========');
    console.info(
      'Architecture: ',
      (global as any)?.nativeFabricUIManager ? 'Fabric' : 'Paper',
    );
  }, []);

  const [isRegularVisible, setRegularVisibility] = useState(false);
  const [isAnimatedVisible, setAnimatedVisibility] = useState(false);
  const [isBlockingVisible, setBlockingVisibility] = useState(false);
  const [isBlurredVisible, setBlurredVisibility] = useState(false);
  const [isGesturedVisible, setGesturedVisibility] = useState(false);
  const [isReanimatedVisible, setReanimatedVisibility] = useState(false);
  const [isInBottomTabVisible, setInBottomTabVisible] = useState(false);
  const [isFullScreenNoBackgroundVisible, setFullScreenNoBackgroundVisible] =
    useState(false);

  if (isInBottomTabVisible) {
    return (
      <InBottomTabsModal
        onRequestDismiss={() => setInBottomTabVisible(false)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Button onPress={() => setRegularVisibility(true)}>Regular</Button>
        <Button onPress={() => setAnimatedVisibility(true)}>Animated</Button>
        <Button onPress={() => setBlockingVisibility(true)}>Blocking</Button>
        <Button onPress={() => setBlurredVisibility(true)}>Blurred</Button>
        <Button onPress={() => setGesturedVisibility(true)}>Gestured</Button>
        <Button onPress={() => setReanimatedVisibility(true)}>
          Reanimated
        </Button>
        <Button onPress={() => setInBottomTabVisible(true)}>
          In Bottom Tab
        </Button>
        <Button onPress={() => setFullScreenNoBackgroundVisible(true)}>
          Full Screen No Background
        </Button>
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
      {isReanimatedVisible && (
        <ReanimatedModal
          onRequestDismiss={() => setReanimatedVisibility(false)}
        />
      )}
      {isFullScreenNoBackgroundVisible && (
        <FullScreenNoBackgroundModal
          onRequestDismiss={() => setFullScreenNoBackgroundVisible(false)}
        />
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
