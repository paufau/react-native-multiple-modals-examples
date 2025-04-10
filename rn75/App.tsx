import {DemoScreen} from 'demo-components';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <StatusBar
          translucent
          backgroundColor={'white'}
          barStyle={'dark-content'}
        />
        <DemoScreen />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
