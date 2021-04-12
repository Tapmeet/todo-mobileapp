import React, { PureComponent } from "react";
import {
    View,
    Image,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    ImageBackground,
    ScrollView,
    TextInput,
    Alert
} from "react-native";
import SQLdatabase from './SQLdatabase';
import { Text, Button, Content, Form, Item, Input, Textarea, Label, Icon, Footer, FooterTab } from 'native-base';
import { styles } from "./CustomStyleSheet";
import { heightPercentageToDP, PixelToDP, responsiveFontSize, widthPercentageToDP } from './PixelRatio';
const db = new SQLdatabase();
//await AsyncStorage.setItem('isLogin', 'true');
export class SignupScreen extends PureComponent {
    static navigationOptions = {
        header: null,
    };
    state = {
        journalsTitle: '',
        journalsDescription: '',

    };
    constructor(props) {
        super(props);
        this.saveTask.bind(this)
    }
    handleTitle = text => {

        this.setState({ journalsTitle: text });
    };
    handleDescription = text => {
        this.setState({ journalsDescription: text });
    };
    saveTask = () => {
        // console.log(this.state.journalsTitle)
        db.getJournals().then(result => {
            let len = result.length;
            let data = {
                Id: len + 1,
                journalsTitle: this.state.journalsTitle,
                journalsDescription: this.state.journalsDescription,
            };
            if (this.state.journalsTitle == '' && this.state.journalsDescription == '') {
                Alert.alert(
                    'Alert',
                    'All Fields are neccessary.',
                    [
                        {
                            text: 'Ok',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },

                    ],
                    { cancelable: false },
                );
                return false
            }
            db.insertInToJournals(data)
                .then(result => {
                    console.log('data saved:' + result);
                    this.props.navigation.navigate('JournalListingsScreen', {
                        resultId: result.Id,
                    });
                })
                .catch(err => {
                    console.log(err);
                });

        });

        console.log('data will be save');
        //db.insertInToTasks(data)

    }
    render() {
        return (
            <View style={styles.flexScreen}>
                <ImageBackground
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    source={require('./Images/gradient.png')}
                    resizeMode={"stretch"}
                >
                    <SafeAreaView style={[styles.titlebar, {
                        borderBottomColor: 'white',
                        borderBottomWidth: 4,
                        paddingBottom: 5,
                        paddingTop: 5,
                        marginBottom: 6,
                    }]}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('LoginScreen')}
                            style={{
                                alignItems: 'center',
                                width: widthPercentageToDP(20),
                            }}>
                            <Image
                                style={styles.backImageIcon}
                                resizeMode={'stretch'}
                                source={require('./Images/back.png')}
                            />
                        </TouchableOpacity>
                        <View
                            style={{
                                alignItems: 'center',
                                width: widthPercentageToDP(60),
                            }}>

                            <Image
                                style={{
                                    height: responsiveFontSize(4),
                                    width: responsiveFontSize(4),
                                }}
                                resizeMode={'contain'}
                                source={require('./Images/logo.png')}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Settings')}
                            style={{
                                alignItems: 'center',
                                width: widthPercentageToDP(20),
                            }}>
                            {/* <Image
                                style={{
                                    height: responsiveFontSize(3.5),
                                    width: responsiveFontSize(3.5),
                                }}
                                resizeMode={'contain'}
                                source={require('./Images/settings.png')}
                            /> */}
                        </TouchableOpacity>
                    </SafeAreaView>
                    <View
                        style={{
                            alignSelf: 'center',
                            width: widthPercentageToDP(100),
                            paddingTop: PixelToDP(20),
                            flexDirection: 'column',
                            alignItem: 'center',
                            height: '100%',
                            backgroundColor: '#30B3AB',
                            zIndex: 333

                        }}>
                        <Text style={styles.registerTitle}>Create Account!</Text>
                        <Text style={[styles.registerText]}>Be Our Member</Text>
                        <TextInput
                            style={[
                                styles.addTaskTextInput,
                                {
                                    borderColor: '#58c3be', textAlign: 'left', borderWidth: PixelToDP(1),
                                    shadowColor: '#121010',
                                    backgroundColor: "#fff",
                                    fontSize: responsiveFontSize(2.3),
                                    borderWidth: 4,
                                    height: 55,
                                    shadowOffset: {
                                        width: 0,
                                        height: 6,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    color: '#4bc9c1',
                                    elevation: 6,
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                    paddingLeft: 15
                                },
                            ]}
                            onChangeText={this.handleTitle}
                            value={this.state.journalsTitle}
                            placeholder={'Name'}
                            placeholderTextColor="#4bc9c1"

                        />
                        <TextInput
                            style={[
                                styles.addTaskTextInput,
                                {
                                    borderColor: '#58c3be', textAlign: 'left', borderWidth: PixelToDP(1),
                                    shadowColor: '#121010',
                                    backgroundColor: "#fff",
                                    fontSize: responsiveFontSize(2.3),
                                    borderWidth: 4,
                                    height: 55,
                                    shadowOffset: {
                                        width: 0,
                                        height: 6,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    color: '#4bc9c1',
                                    elevation: 6,
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                    paddingLeft: 15
                                },
                            ]}
                            onChangeText={this.handleTitle}
                            value={this.state.journalsTitle}
                            placeholder={'Email'}
                            placeholderTextColor="#4bc9c1"

                        />
                        <TextInput
                            style={[
                                styles.addTaskTextInput,
                                {
                                    borderColor: '#58c3be', textAlign: 'left', borderWidth: PixelToDP(1),
                                    shadowColor: '#121010',
                                    backgroundColor: "#fff",
                                    fontSize: responsiveFontSize(2.3),
                                    borderWidth: 4,
                                    height: 55,
                                    shadowOffset: {
                                        width: 0,
                                        height: 6,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    color: '#4bc9c1',
                                    elevation: 6,
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                    paddingLeft: 15
                                },
                            ]}
                            onChangeText={this.handleTitle}
                            value={this.state.journalsTitle}
                            placeholder={'Phone Number'}
                            placeholderTextColor="#4bc9c1"

                        />
                        <TextInput
                            style={[
                                styles.addTaskTextInput,
                                {
                                    borderColor: '#58c3be', textAlign: 'left', borderWidth: PixelToDP(1),
                                    shadowColor: '#121010',
                                    backgroundColor: "#fff",
                                    fontSize: responsiveFontSize(2.3),
                                    borderWidth: 4,
                                    height: 55,
                                    shadowOffset: {
                                        width: 0,
                                        height: 6,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    color: '#4bc9c1',
                                    elevation: 6,
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                    paddingLeft: 15
                                },
                            ]}
                            onChangeText={this.handleTitle}
                            value={this.state.journalsTitle}
                            placeholder={'Password'}
                            placeholderTextColor="#4bc9c1"

                        />
                           <TextInput
                            style={[
                                styles.addTaskTextInput,
                                {
                                    borderColor: '#58c3be', textAlign: 'left', borderWidth: PixelToDP(1),
                                    shadowColor: '#121010',
                                    backgroundColor: "#fff",
                                    fontSize: responsiveFontSize(2.3),
                                    borderWidth: 4,
                                    height: 55,
                                    shadowOffset: {
                                        width: 0,
                                        height: 6,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    color: '#4bc9c1',
                                    elevation: 6,
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                    paddingLeft: 15
                                },
                            ]}
                            onChangeText={this.handleTitle}
                            value={this.state.journalsTitle}
                            placeholder={'Confirm Password'}
                            placeholderTextColor="#4bc9c1"

                        />
                        <Button
                            style={{
                                width: widthPercentageToDP(90),
                                alignSelf: 'center',
                                height: PixelToDP(40),
                                alignItems: 'center',
                                marginBottom: PixelToDP(10),
                                marginTop: PixelToDP(30),
                                borderColor: '#58c3be', textAlign: 'center', borderWidth: PixelToDP(1),
                                shadowColor: '#121010',
                                backgroundColor: "#fff",
                                fontSize: responsiveFontSize(2.3),
                                borderWidth: 4,
                                height: 55,
                                shadowOffset: {
                                    width: 0,
                                    height: 6,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                color: '#4bc9c1',
                                elevation: 6,
                                paddingTop: 10,
                                paddingBottom: 10,
                                borderRadius: 20,
                            }}
                            onPress={this.saveTask}
                        >
                            <Text
                                style={{
                                    color: '#4bc9c1',
                                    width: '100%',
                                    textTransform: 'uppercase',
                                    fontSize: PixelToDP(18),
                                    textAlign: 'center',
                                    textAlignVertical: 'center',
                                    fontWeight: "bold"
                                }}>
                                Register
                            </Text>
                        </Button>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}
