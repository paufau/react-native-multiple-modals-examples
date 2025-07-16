import {ComponentType, useCallback, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AnimatedModal} from './modals/animated/AnimatedModal';
import {BlockingModal} from './modals/blocking/BlockingModal';
import {BlurredModal} from './modals/blurred/BlurredModal';
import {GesturedModal} from './modals/gestured/GesturedModal';
import {InBottomTabsModal} from './modals/in-bottom-tabs-modal/InBottomTabsModal';
import {ReanimatedModal} from './modals/reanimated/ReanimatedModal';
import {RegularModal} from './modals/regular/RegularModal';
import {useTheme} from './theme/colors';
import {FullScreenNoBackgroundModal} from './modals/full-screen-no-bg/FullScreenNoBackgroundModal';
import {WithNavigationInsideModal} from './modals/with-navigation-inside/WithNavigationInsideModal';
import {ScenarioCard} from './components/scenario-card/ScenarioCard';
import {Typography} from './components/typography/Typography';

type DemoCase = {
  id: string;
  title: string;
  description: string;
  Component: ComponentType<any>;
  additionalProps?: object;
  isExclusive?: boolean;
};

export const DemoScreen = () => {
  // @ts-ignore
  const isFabric = (global as any)?.nativeFabricUIManager;
  const architecture = isFabric ? 'Fabric 🚀' : 'Paper ✈️';
  const {colors} = useTheme();

  const [activeCases, setActiveCases] = useState<DemoCase[]>([]);

  const openModal = useCallback((caseId: string) => {
    const demoCase = demoCases.find(c => c.id === caseId);

    if (demoCase) {
      setActiveCases(prev => [...prev, demoCase]);
    } else {
      console.error(`Demo case with id "${caseId}" not found.`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = useCallback((caseId: string) => {
    setActiveCases(prev => prev.filter(c => c.id !== caseId));
  }, []);

  const demoCases = useMemo<DemoCase[]>(
    () => [
      {
        id: 'regular',
        title: 'Regular Modal',
        description: 'A simple modal that can be dismissed.',
        Component: RegularModal,
      },
      {
        id: 'animated',
        title: 'Animated Modal',
        description: 'A modal with custom animations.',
        Component: AnimatedModal,
      },
      {
        id: 'blocking',
        title: 'Blocking Modal',
        description: 'A modal that blocks interaction with the background.',
        Component: BlockingModal,
        additionalProps: {
          onOpenAnother: () => openModal('animated'),
        },
      },
      {
        id: 'blurred',
        title: 'Blurred Modal',
        description: 'A modal with a blurred background effect.',
        Component: BlurredModal,
      },
      {
        id: 'gestured',
        title: 'Gestured Modal',
        description: 'A modal that supports gestures for dragging.',
        Component: GesturedModal,
      },
      {
        id: 'reanimated',
        title: 'Reanimated Modal',
        description: 'A modal using Reanimated for advanced animations.',
        Component: ReanimatedModal,
      },
      {
        id: 'in-bottom-tab',
        title: 'In Bottom Tab Modal',
        description: 'A modal displayed above a bottom tab navigator.',
        Component: InBottomTabsModal,
        isExclusive: true,
      },
      {
        id: 'full-screen-no-bg',
        title: 'Full Screen No Background Modal',
        description:
          'A full-screen modal without a background, useful for immersive experiences.',
        Component: FullScreenNoBackgroundModal,
      },
      {
        id: 'with-navigation-inside',
        title: 'With Navigation Inside Modal',
        description: 'A modal that contains a navigation stack inside it.',
        Component: WithNavigationInsideModal,
      },
    ],
    [openModal],
  );

  const isLastCaseExclusive = useMemo(() => {
    const lastCase = activeCases[activeCases.length - 1];
    if (!lastCase) {
      return false;
    }
    return lastCase.isExclusive;
  }, [activeCases]);

  if (isLastCaseExclusive && activeCases.length > 0) {
    const lastCase = activeCases[activeCases.length - 1];

    return (
      <lastCase.Component
        {...lastCase.additionalProps}
        onRequestDismiss={() => closeModal(lastCase.id)}
      />
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, {backgroundColor: colors.background}]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}>
        <Typography style={styles.architecture}>
          Current Architecture: {architecture}
        </Typography>

        <View style={styles.casesContainer}>
          {demoCases.map(({title, description, id}) => (
            <ScenarioCard
              key={id}
              title={title}
              description={description}
              onPress={() => {
                openModal(id);
              }}
            />
          ))}
        </View>
      </ScrollView>

      {activeCases.map(({Component, id, additionalProps}) => (
        <Component
          key={id}
          {...additionalProps}
          onRequestDismiss={() => closeModal(id)}
        />
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  architecture: {
    marginTop: 32,
    fontSize: 20,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 24,
  },
  casesContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    maxWidth: 800,
    marginBottom: 48,
  },
});
