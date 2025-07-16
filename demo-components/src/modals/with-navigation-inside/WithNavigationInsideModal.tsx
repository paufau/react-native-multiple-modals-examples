import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ModalView} from 'react-native-multiple-modals';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Button} from '../../components/button/Button';
import {COLORS} from '../../theme/colors';

type WithNavigationInsideModalProps = {
  onRequestDismiss: () => void;
};

const TabNavigator = createBottomTabNavigator();

export const WithNavigationInsideModal: FC<WithNavigationInsideModalProps> = ({
  onRequestDismiss,
}) => {
  return (
    <View style={styles.screen}>
      <Text>Some content</Text>
      <ModalView
        onRequestDismiss={onRequestDismiss}
        contentContainerStyle={styles.contentContainer}>
        <BottomTabsNavigator />
        <Button style={styles.confirmButton} onPress={onRequestDismiss}>
          Dismiss
        </Button>
      </ModalView>
    </View>
  );
};

const MockScreen = () => {
  return <View style={{flex: 1, backgroundColor: 'magenta'}} />;
};

export const BottomTabsNavigator = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <TabNavigator.Navigator>
          <TabNavigator.Screen name="initial" component={MockScreen} />
        </TabNavigator.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
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
  confirmButton: {
    marginTop: 16,
  },
  screen: {
    flex: 1,
  },
});
