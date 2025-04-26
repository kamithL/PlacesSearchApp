// App.tsx
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import * as Crypto from 'expo-crypto';
if (typeof global.crypto === 'undefined') { // @ts-ignore
    global.crypto = Crypto;
}

export { default } from 'expo-router';
