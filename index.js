// index.js
import 'react-native-gesture-handler'; // debe estar antes que React y cualquier otro import
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);

