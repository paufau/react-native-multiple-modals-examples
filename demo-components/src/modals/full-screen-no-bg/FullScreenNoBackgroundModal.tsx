import {FC} from 'react';
import {StyleSheet} from 'react-native';
import {ModalView} from 'react-native-multiple-modals';
import {AlertContent} from '../../components/alert-content/AlertContent';
import {useTheme} from '../../theme/colors';
import {BaseModalProps} from '../BaseModal';

type FullScreenNoBackgroundModalProps = BaseModalProps;

export const FullScreenNoBackgroundModal: FC<
  FullScreenNoBackgroundModalProps
> = props => {
  const {colors} = useTheme();

  return (
    <ModalView
      onRequestDismiss={props.onRequestDismiss}
      backdropColor={colors.backgroundHighlight}
      contentContainerStyle={styles.contentContainer}
      statusBar={{
        animated: true,
        barStyle: 'dark-content',
        translucent: true,
      }}>
      <AlertContent {...props} />
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
