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
var resultId = "", deleteId = "";
export class JournalListingsScreen extends PureComponent {
    static navigationOptions = {
        header: null,
    };
    state = {
        data: [],
    };
    componentDidMount() {
        this._subscribe = this.props.navigation.addListener('didFocus', () => {
            resultId = this.props.navigation.getParam('resultId');
            deleteId = this.props.navigation.getParam('deleteId');
            console.log(resultId);
            console.log(deleteId);
            this.getJournal();
        });
    }
    getJournal() {
        db.getJournals().then(result => {
            this.setState({ data: result })
        });
    }
    // clickLink = (Id, Title, Description) => {
    //     this.props.navigation.navigate("EditJournalScreen", {
    //         Id: Id,
    //         journalsTitle: Title,
    //         journalsDescription: Description
    //     })

    // }
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
                            onPress={() => this.props.navigation.navigate('Home')}
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
                            <Image
                                style={{
                                    height: responsiveFontSize(3.5),
                                    width: responsiveFontSize(3.5),
                                }}
                                resizeMode={'contain'}
                                source={require('./Images/settings.png')}
                            />
                        </TouchableOpacity>
                    </SafeAreaView>
                    <View
                        style={{
                            alignSelf: 'center',
                            width: widthPercentageToDP(100),
                            paddingTop: PixelToDP(20),
                            flexDirection: 'column',
                            alignItem: 'center',
                            height: '75%',
                            backgroundColor: '#30B3AB',
                            zIndex: 333

                        }}>
                        <Text
                            style={[
                                styles.addTaskTextInput,
                                {
                                    borderColor: '#58c3be', borderWidth: PixelToDP(1),
                                    shadowColor: '#121010',
                                    backgroundColor: "#fff",
                                    fontSize: responsiveFontSize(2.3),
                                    textAlign: 'center',
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
                                    paddingTop: 15,
                                    paddingBottom: 8
                                },
                            ]}
                        >
                            Your Journals List
                            </Text>
                        {this.state.data.length > 0 ?

                            this.state.data.map((journals, index) => (
                                <View
                                    style={{
                                        borderWidth: 6,
                                        borderRadius: PixelToDP(20),
                                        borderColor: "#58c3be",
                                        width: widthPercentageToDP(90),
                                        alignSelf: 'center',
                                        flexDirection: 'column',
                                        alignItem: 'center',
                                        marginBottom: PixelToDP(20),
                                        backgroundColor: "#fff",
                                        shadowColor: '#121010',
                                        shadowOffset: {
                                            width: 0,
                                            height: 6,
                                        },
                                        shadowOpacity: 0.25,
                                        elevation: 6,
                                        shadowRadius: 3.84,
                                    }}

                                >
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate("EditJournalScreen", {
                                        data: journals
                                    })
                                    } >
                                        <Text style={{
                                            color: '#4bc9c1',
                                            paddingTop: 10,
                                            paddingBottom: 10,
                                            fontSize: responsiveFontSize(2.3),
                                            paddingLeft: 15,
                                        }}>{index + 1}. {journals.journalsTitle}</Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                            : <View
                                style={{
                                    borderWidth: 6,
                                    borderRadius: PixelToDP(20),
                                    borderColor: "#58c3be",
                                    width: widthPercentageToDP(90),
                                    alignSelf: 'center',
                                    flexDirection: 'column',
                                    alignItem: 'center',
                                    marginBottom: PixelToDP(20),
                                    backgroundColor: "#fff",
                                    shadowColor: '#121010',
                                    shadowOffset: {
                                        width: 0,
                                        height: 6,
                                    },
                                    shadowOpacity: 0.25,
                                    elevation: 6,
                                    shadowRadius: 3.84,
                                }}

                            >
                                <Text style={{
                                    color: '#4bc9c1',
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                    fontSize: responsiveFontSize(2.3),
                                    paddingLeft: 15,
                                    textAlign: "center"
                                }}>No Journals.</Text>
                            </View>
                        }
                    </View>
                    <View
                        style={{
                            width: widthPercentageToDP(40),
                            borderRadius: widthPercentageToDP(40),
                            backgroundColor: '#8fc6c2',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            width: '90%',
                            marginTop: 50,
                            margin: 'auto',
                            alignSelf: 'center',
                            shadowColor: '#3ca29b',
                            shadowOffset: {
                                width: 0,
                                height: 5,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 5.46,
                            elevation: 4,
                            position: 'absolute',
                            height: heightPercentageToDP(9),
                            top: heightPercentageToDP(77),
                        }}>
                        <TouchableOpacity
                            style={{
                                height: 'auto',
                                alignItems: 'center',
                            }}
                            onPress={() => this.props.navigation.navigate('JournalScreen')}
                        >
                            <Image
                                style={{
                                    alignSelf: 'center',
                                    height: heightPercentageToDP(10.5),
                                    width: heightPercentageToDP(10.5),
                                }}
                                resizeMode={'contain'}
                                source={require('./Images/plus.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            width: widthPercentageToDP(40),
                            borderRadius: widthPercentageToDP(40),
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            width: '90%',
                            margin: 'auto',
                            alignSelf: 'center',
                            position: 'absolute',
                            top: heightPercentageToDP(95),
                        }}>
                        <Text style={{
                            color: "white",
                            fontSize: responsiveFontSize(2.2),
                            textTransform: 'capitalize',
                            fontFamily: 'Oswald-Regular',
                            letterSpacing: 0.7,
                            top: 5
                        }}>New Journal</Text>

                    </View>
                </ImageBackground>
            </View>
        );
    }
}
