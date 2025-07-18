import {FC} from 'react';
import {StyleSheet} from 'react-native';
import {ModalView} from 'react-native-multiple-modals';
import {AlertContent} from '../../components/alert-content/AlertContent';

type AnimatedSlideModalProps = {
  onRequestDismiss: () => void;
  testID: string;
};

export const AnimatedSlideModal: FC<AnimatedSlideModalProps> = ({
  onRequestDismiss,
  testID,
}) => {
  return (
    <ModalView
      onRequestDismiss={onRequestDismiss}
      contentContainerStyle={styles.contentContainer}
      animationType="slide">
      <AlertContent
        onRequestDismiss={onRequestDismiss}
        testID={testID}
        style={styles.modal}
      />
    </ModalView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: 'flex-end',
  },
  modal: {
    width: '100%',
    borderRadius: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
});
