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
export class EditJournalScreen extends PureComponent {
    constructor(props) {
        super(props);
        console.log('heresss')
        console.log(props.navigation.state.params.data)
        this.state = {
            Id: props.navigation.state.params.data.Id,
            journalsTitle: props.navigation.state.params.data.journalsTitle,
            journalsDescription: props.navigation.state.params.data.journalsDescription,

        };
    }
    static navigationOptions = {
        header: null,
    };


    handleTitle = text => {

        this.setState({ journalsTitle: text });
    };
    handleDescription = text => {
        this.setState({ journalsDescription: text });
    };
    componentDidMount() {
        // console.log('here');
        // this.getJournal();
    }
    updateTask = () => {
        console.log(this.state.journalsTitle)
        let data = {
            journalsTitle: this.state.journalsTitle,
            journalsDescription: this.state.journalsDescription,
            isActive: 1
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
        db.updateJournals(this.state.Id, data)
            .then(result => {
                console.log('data saveded:' + result);
                this.props.navigation.navigate('JournalListingsScreen', {
                    resultId: result.Id,
                });
            })
            .catch(err => {
                console.log(err);
            });



        console.log('data will be save');
        //db.insertInToTasks(data)

    }
    deleteJournal = () => {
        db.deleteJournals(this.state.Id)
            .then(result => {
                this.props.navigation.navigate('JournalListingsScreen', {
                    deleteId: result.Id,
                });
            })
            .catch(err => {
                console.log(err);
            });
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
                    <SafeAreaView style={styles.titlebar}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('JournalListingsScreen')}
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
                            height: '100%',
                            backgroundColor: '#30B3AB',
                            marginTop: 0

                        }}>
                        <TextInput
                            style={styles.TextInputCommon}
                            onChangeText={this.handleTitle}
                            value={this.state.journalsTitle}
                            placeholder={'Name Your Journal:'}
                            placeholderTextColor="#4bc9c1"

                        />
                        <View
                            style={{
                                borderWidth: 6,
                                borderRadius: PixelToDP(20),
                                borderColor: "#3a9f9a",
                                width: widthPercentageToDP(90),
                                alignSelf: 'center',
                                paddingTop: PixelToDP(5),
                                flexDirection: 'column',
                                alignItem: 'center',
                                paddingBottom: PixelToDP(20),
                                backgroundColor: "#fff"
                            }}>

                            <Text
                                style={{
                                    fontSize: responsiveFontSize(2.5),
                                    fontWeight: 'bold',
                                    width: '100%',
                                    marginBottom: PixelToDP(5),
                                    textAlign: 'center',
                                    textAlignVertical: 'center',
                                    color: '#4bc9c1',
                                    alignSelf: "center"
                                }}> Your Journal!</Text>
                            <View style={[styles.boxShadow, {
                                borderWidth: 6,
                                borderTopLeftRadius: PixelToDP(40),
                                borderBottomRightRadius: PixelToDP(40),
                                borderColor: "#3a9f9a",
                                width: widthPercentageToDP(75),
                                alignSelf: "center",
                                backgroundColor: "#22DCD3",
                                padding: 15,
                                paddingtop: 35,
                                paddingBottom: 35,
                                justifyContent: "flex-start",

                            }]}>
                                <Text style={{ width: '90%', textAlign: "center", color: "white", alignSelf: "center", fontSize: responsiveFontSize(2), fontWeight: "bold" }}>Press Here To Enter Your Journal!</Text>
                                <TextInput
                                    style={[
                                        styles.addTaskDescTextInputGoalTask,
                                        { color: 'white', fontSize: responsiveFontSize(2), lineHeight: 30 },
                                    ]}
                                    multiline={true}
                                    returnKeyType={"done"}
                                    numberOfLines={15}
                                    placeholderTextColor="#ffffff"
                                    clearTextOnFocus={true}
                                    placeholder={
                                        'Description: Give more detail about this Journal.'
                                    }
                                    value={this.state.journalsDescription}
                                    onChangeText={this.handleDescription}
                                />
                            </View>
                        </View>
                        <Button
                            style={styles.buttonLogin}
                            onPress={this.updateTask}
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
                                Update
                            </Text>
                        </Button>
                    </View>
                    <View
                        style={styles.buttonsFooter}>
                        <TouchableOpacity
                            style={{
                                height: 'auto',
                                alignItems: 'center',
                            }}
                            onPress={() => this.props.navigation.navigate('JournalListingsScreen')}>
                            <Image
                                style={{
                                    alignSelf: 'center',
                                    height: heightPercentageToDP(9),
                                    width: heightPercentageToDP(9),
                                }}
                                resizeMode={'contain'}
                                source={require('./Images/back-icon.png')}
                            />
                        </TouchableOpacity>
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
                        <TouchableOpacity
                            style={{
                                height: 'auto',
                                alignItems: 'center',
                            }}
                            onPress={() => {
                                Alert.alert(
                                    'Alert',
                                    'Are you sure you want to delete this Journal ?',
                                    [
                                        {
                                            text: 'Cancel',
                                            onPress: () => console.log('Cancel Pressed'),
                                            style: 'cancel',
                                        },
                                        { text: 'OK', onPress: () => this.deleteJournal() },
                                    ],
                                    { cancelable: false },
                                );

                            }}>

                            <Image
                                style={{
                                    alignSelf: 'center',
                                    height: heightPercentageToDP(9),
                                    width: heightPercentageToDP(9),
                                }}
                                resizeMode={'contain'}
                                source={require('./Images/trash.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View
                        style={styles.buttonsFooterText}>
                        <Text style={styles.buttonsFooterTextTitle}>Back</Text>
                        <Text style={[styles.buttonsFooterTextTitle, {
                            top: 5
                        }]}>New Journal </Text>
                        <Text style={styles.buttonsFooterTextTitle}> Delete</Text>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}
