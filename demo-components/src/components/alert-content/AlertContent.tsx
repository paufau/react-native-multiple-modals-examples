import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Typography} from '../typography/Typography';
import {DocumentationLinkText} from '../documentation-link-text/DocumentationLinkText';
import {Button} from '../button/Button';
import {FC} from 'react';
import {useTheme} from '../../theme/colors';

type AlertContentProps = {
  onRequestDismiss: () => void;
  testID: string;
  style?: StyleProp<ViewStyle>;
};

export const AlertContent: FC<AlertContentProps> = ({
  onRequestDismiss,
  testID,
  style,
}) => {
  const {colors} = useTheme();

  return (
    <View
      style={[
        styles.modal,
        {
          borderColor: colors.cardOutline,
          backgroundColor: colors.background,
        },
        style,
      ]}
      testID={`${testID}-modal`}>
      <Typography variant="title" color="primary">
        Simple Modal
      </Typography>
      <DocumentationLinkText />
      <Button onPress={onRequestDismiss} testID={`${testID}-close-button`}>
        Close
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: '80%',
    borderRadius: 24,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    padding: 20,
    gap: 16,
    borderWidth: 1,
    boxShadow: '0 4px 8px rgba(0, 0, 0, .03)',
  },
});
