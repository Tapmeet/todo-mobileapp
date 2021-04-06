import React, { PureComponent } from "react";
import {
    View,
    Image,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    ImageBackground,
    ScrollView,
    TextInput
} from "react-native";
import { Text, Button, Content, Form, Item, Input, Textarea, Label, Icon, Footer, FooterTab } from 'native-base';
import { styles } from "./CustomStyleSheet";
import { heightPercentageToDP, PixelToDP, responsiveFontSize, widthPercentageToDP } from './PixelRatio';

//await AsyncStorage.setItem('isLogin', 'true');
export class JournalScreen extends PureComponent {
    static navigationOptions = {
        header: null
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
                            height: '100%',
                            backgroundColor: '#30B3AB',
                            zIndex: 333

                        }}>
                        <TextInput
                            style={[
                                styles.addTaskTextInput,
                                {
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
                                    paddingBottom: 10
                                },
                            ]}

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
                                    // height: PixelToDP(60),
                                    width: '100%',
                                    marginBottom: PixelToDP(5),
                                    textAlign: 'center',
                                    textAlignVertical: 'center',
                                    color: '#4bc9c1',
                                    alignSelf: "center"
                                }}>Describe Your Journal!</Text>
                            <View style={{
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
                                shadowColor: '#121010',
                                shadowOffset: {
                                    width: 0,
                                    height: 10,
                                },
                                shadowOpacity: 0.8,
                                shadowRadius: 3.84,
                                elevation: 10,
                            }}>
                                <Text style={{ width: '90%', textAlign: "center", color: "white", alignSelf: "center", fontSize: responsiveFontSize(2), fontWeight: "bold" }}>Press Here To Enter Your Journal!</Text>
                                <TextInput
                                    style={[
                                        styles.addTaskDescTextInputGoalTask,
                                        { color: 'white', fontSize: responsiveFontSize(2), lineHeight: 30 },
                                    ]}
                                    ref='taskDescription'
                                    multiline={true}
                                    returnKeyType={"done"}
                                    numberOfLines={15}
                                    placeholderTextColor="#ffffff"
                                    clearTextOnFocus={true}
                                    onKeyPress={(e) => {
                                        if (e.nativeEvent.key == "Enter" || e.nativeEvent.key == "done") {
                                            console.log('CreateTaskDialog onKeyPress is called');
                                            Keyboard.dismiss();
                                        }
                                    }}
                                    placeholder={
                                        'Description: Give more detail about this Journal.'
                                    }
                                    onChangeText={this.handleDescription}
                                />
                            </View>
                        </View>
                        <Button
                            style={{
                                width: widthPercentageToDP(90),
                                alignSelf: 'center',
                                height: PixelToDP(40),
                                alignItems: 'center',
                                marginBottom: PixelToDP(10),
                                marginTop: PixelToDP(50),
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
                                Submit
                            </Text>
                        </Button>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}
