import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    TextInput,
    StyleSheet,
    Alert,
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';

// Styles
import basicStyles from '../../styles/BasicStyles';

// Components
// import HeaderComponent from '../components/HeaderComponent';
// import CustomLoader from '../components/CustomLoader';
// import ProcessingLoader from '../components/ProcessingLoader';

// // API
// import {BASE_URL, makeRequest} from '../api/ApiInfo';

// // User Preference
// import {KEYS, getData} from '../api/UserPreference';

export default class ImportantContact extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            importantContacts: [{ name: '', mobile: '' }],
        };
    }

    handleImportantContacts = (name, price) => {
        let { importantContacts } = this.state;
        let mnc = { name: name, mobile: price };

        let important = importantContacts.push(mnc);
        console.log(importantContacts);
        console.log(important);
        this.setState({ importantContacts });
    };

    renderContactForm = () => {
        const { importantContacts } = this.state;
        // console.log(importantContacts);
        return importantContacts.map((contact, index) => {
            const handleNameChange = (newName) => {
                contact.name = newName;
                this.setState({ importantContacts });
            };

            const handleMobileChange = (newMobile) => {
                contact.mobile = newMobile;
                this.setState({ importantContacts });
            };

            return (
                <View
                    style={[
                        basicStyles.directionRow,
                        basicStyles.marginBottom,
                        basicStyles.alignCenter,
                    ]}
                    key={index}>
                    <TextInput
                        placeholder="User Name"
                        placeholderTextColor="#666"
                        style={styles.input}
                        value={contact.name}
                        onChangeText={handleNameChange}
                    />
                    <TextInput
                        placeholder="User mobile"
                        placeholderTextColor="#666"
                        maxLength={10}
                        keyboardType="numeric"
                        style={styles.input}
                        value={contact.mobile ? contact.mobile.toString() : null}
                        onChangeText={handleMobileChange}
                    />
                </View>
            );
        });
    };

    render() {
        const { isLoading } = this.state;
        // if (isLoading) {
        //   return <CustomLoader />;
        // }

        return (
            <SafeAreaView style={basicStyles.container}>
                {/* <HeaderComponent
          headerTitle="Important Contact"
          nav={this.props.navigation}
          navAction="back"
        /> */}
                <View style={[basicStyles.mainContainer, basicStyles.padding]}>
                    <View
                        style={[
                            basicStyles.directionRow,
                            basicStyles.marginBottom,
                            basicStyles.alignCenter,
                        ]}>
                        <Text style={[basicStyles.text, styles.sr]} />
                        <Text
                            placeholderTextColor="#666"
                            style={[basicStyles.flexOne, styles.title]}>
                            Name
            </Text>
                        <Text
                            placeholderTextColor="#666"
                            style={[basicStyles.flexOne, styles.title]}>
                            Phone No.
            </Text>
                    </View>

                    {this.renderContactForm()}

                    <TouchableHighlight
                        style={styles.updateButton}
                        onPress={this.handleImportantContacts}>
                        <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                            Update
            </Text>
                    </TouchableHighlight>
                </View>
                {/* {this.state.showProcessingLoader && <ProcessingLoader />} */}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        marginLeft: wp(5),
        fontSize: wp(3.5),
        fontWeight: '700',
    },
    sr: {
        width: wp(4),
    },
    input: {
        height: hp(5.5),
        fontSize: wp(3),
        borderWidth: 1,
        borderColor: '#ccc',
        flex: 2.5,
        borderRadius: 5,
        marginLeft: wp(5),
        paddingHorizontal: wp(2),
    },
    textareaContainerMain: {
        flex: 1,
    },
    textareaContainer: {
        height: hp(15),
        paddingHorizontal: wp(1),
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginLeft: wp(3),
        width: '96%',
    },
    textarea: {
        textAlignVertical: 'top', // hack android
        fontSize: wp(3),
        color: '#333',
    },
    updateButton: {
        backgroundColor: '#0082c7',
        height: hp(6),
        borderRadius: wp(5),
        alignSelf: 'center',
        paddingHorizontal: wp(10),
        justifyContent: 'center',
        margin: wp(2),
    },
});