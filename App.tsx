import {SafeAreaProvider} from 'react-native-safe-area-context';
import {DemoScreen} from './src/DemoScreen';

function App() {
  return (
    <SafeAreaProvider>
      <DemoScreen />
    </SafeAreaProvider>
  );
}

export default App;
