import {FC} from 'react';
import {StatusBarProps, StyleSheet, Text, View} from 'react-native';
import {ModalView} from 'react-native-multiple-modals';
import {Button} from '../../components/button/Button';
import {COLORS} from '../../theme/colors';

type RegularModalProps = {
  onRequestDismiss: () => void;
};

export const RegularModal: FC<RegularModalProps> = ({onRequestDismiss}) => {
  return (
    <ModalView
      onRequestDismiss={onRequestDismiss}
      contentContainerStyle={styles.contentContainer}
      statusBar={
        {
          barStyle: 'light-content',
          translucent: true,
        } satisfies StatusBarProps
      }>
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
});
