import {FC} from 'react';
import {StyleSheet} from 'react-native';
import {ModalView} from 'react-native-multiple-modals';
import {AlertContent} from '../../components/alert-content/AlertContent';

type AnimatedFadeModalProps = {
  onRequestDismiss: () => void;
  testID: string;
};

export const AnimatedFadeModal: FC<AnimatedFadeModalProps> = ({
  onRequestDismiss,
  testID,
}) => {
  return (
    <ModalView
      onRequestDismiss={onRequestDismiss}
      contentContainerStyle={styles.contentContainer}
      animationType="fade"
      statusBar={{
        animated: true,
        barStyle: 'light-content',
        translucent: true,
      }}>
      <AlertContent onRequestDismiss={onRequestDismiss} testID={testID} />
    </ModalView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
