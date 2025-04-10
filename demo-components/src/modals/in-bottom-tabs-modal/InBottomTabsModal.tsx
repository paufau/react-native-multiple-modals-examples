import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {FC, useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ModalView} from 'react-native-multiple-modals';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Button} from '../../components/button/Button';
import {COLORS} from '../../theme/colors';

type InBottomTabsModalProps = {
  onRequestDismiss: () => void;
};

const TabNavigator = createBottomTabNavigator();

const ScreenWithModal: FC<InBottomTabsModalProps> = ({onRequestDismiss}) => {
  return (
    <View style={styles.screen}>
      <Text>Some content</Text>
      <ModalView
        onRequestDismiss={onRequestDismiss}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.modal}>
          <Text style={styles.title}>Request Confirmation</Text>
          <Text style={styles.description}>
            We will process your request and contact you as soon as possible.
          </Text>
          {/*  */}
          <Button style={styles.confirmButton} onPress={onRequestDismiss}>
            Confirm
          </Button>
        </View>
      </ModalView>
    </View>
  );
};

export const InBottomTabsModal: FC<InBottomTabsModalProps> = props => {
  const MemoizedScreenWithModal = useCallback(
    () => <ScreenWithModal {...props} />,
    [props],
  );

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <TabNavigator.Navigator>
          <TabNavigator.Screen
            name="initial"
            component={MemoizedScreenWithModal}
          />
        </TabNavigator.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
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
  confirmButton: {
    marginTop: 16,
  },
  screen: {
    flex: 1,
  },
});
