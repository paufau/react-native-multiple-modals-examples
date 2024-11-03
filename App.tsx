import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {DemoScreen} from './src/DemoScreen';

function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <DemoScreen />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
