// polyfills.js
import 'react-native-get-random-values';
import * as Crypto from 'expo-crypto';

if (typeof global.crypto === 'undefined') {
    global.crypto = Crypto;
}
