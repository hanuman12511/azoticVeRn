import React from 'react';
import { View } from 'react-native';
import basicStyles from './BasicStyles';
import WebView from 'react-native-webview';
//import BasicStyles from './BasicStyles';

const Vendor_Help = () => {
    return (
        <View style={[basicStyles.flexOne]}>
            <WebView source={{ uri: 'https://google.com' }} />
        </View>
    );
};

export default Vendor_Help;
