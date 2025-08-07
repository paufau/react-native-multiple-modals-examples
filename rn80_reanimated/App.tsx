import { useState } from 'react';
import { Button, Modal, View } from 'react-native';
import Animated, { SlideInUp } from 'react-native-reanimated';

function App() {
  const [isVisible, setVisibility] = useState(false);

  return (
    <View>
      <Button title="Open modal" onPress={() => setVisibility(true)} />
      {isVisible && (
        <Modal
          backdropColor="rgba(0,0,0,0.5)"
          onRequestClose={() => setVisibility(false)}
        >
          <Animated.View
            entering={SlideInUp}
            style={{ width: 300, height: 200, backgroundColor: 'red' }}
          />
        </Modal>
      )}
    </View>
  );
}

export default App;
