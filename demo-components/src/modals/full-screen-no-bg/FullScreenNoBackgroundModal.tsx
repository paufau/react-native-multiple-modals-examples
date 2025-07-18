import {FC} from 'react';
import {ModalView} from 'react-native-multiple-modals';
import {AlertContent} from '../../components/alert-content/AlertContent';
import {useTheme} from '../../theme/colors';
import {StyleSheet} from 'react-native';

type FullScreenNoBackgroundModalProps = {
  onRequestDismiss: () => void;
  testID: string;
};

export const FullScreenNoBackgroundModal: FC<
  FullScreenNoBackgroundModalProps
> = ({onRequestDismiss, testID}) => {
  const {colors} = useTheme();

  return (
    <ModalView
      onRequestDismiss={onRequestDismiss}
      backdropColor={colors.backgroundHighlight}
      contentContainerStyle={styles.contentContainer}
      statusBar={{
        animated: true,
        barStyle: 'dark-content',
        translucent: true,
      }}>
      <AlertContent onRequestDismiss={onRequestDismiss} testID={testID} />
    </ModalView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
