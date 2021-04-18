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
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmpassword: '',
        errorMessage: ''
    };
    constructor(props) {
        super(props);

    }
    ValidateEmail = (mail) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
    };
    handleFullName = text => {
        this.setState({ fullName: text });
    };
    handleEmail = text => {
        this.setState({ email: text });
    };
    handlePhone = text => {
        this.setState({ phone: text });
    };
    handlePassword = text => {
        this.setState({ password: text });
    };
    handleConfirmPassword = text => {
        this.setState({ confirmpassword: text });
    };
    handleSignup = () => {
        this.setState({ errorMessage: '' });
        if (this.state.fullName == "") {
            this.setState({ errorMessage: "Enter Name" });
            return false;
        }
        if (this.state.email == "") {
            this.setState({ errorMessage: "Enter Email" });
            return false;
        }
        let checkemail = this.ValidateEmail(this.state.email);
        if (checkemail == false) {
            this.setState({ errorMessage: "Enter Valid Email" });
            return false;
        }
        if (this.state.password == "") {
            this.setState({ errorMessage: "Enter Pasword" });
        }
        if (this.state.confirmpassword == "") {
            this.setState({ errorMessage: "Enter Confirm Pasword" });
        }
        if (this.state.password != this.state.confirmpassword) {
            this.setState({ errorMessage: "Password doesn't match" });
        }
        fetch(`http://192.168.18.22:2000/api/auth/register`, {
            method: "POST",
            headers: {
                Accept: "*/*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fullName: this.state.fullName,
                email: this.state.email,
                password: this.state.password,
                phone: this.state.phone,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                console.log(response);
            })
            .catch(function (data) {
                console.log(data);
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

                        <TextInput
                            style={styles.TextInputCommon}
                            onChangeText={this.handleFullName}
                            value={this.state.fullName}
                            placeholder={'Full Name'}
                            placeholderTextColor="#4bc9c1"

                        />
                        <TextInput
                            style={styles.TextInputCommon}
                            onChangeText={this.handleEmail}
                            value={this.state.email}
                            placeholder={'Email'}
                            placeholderTextColor="#4bc9c1"

                        />
                        <TextInput
                            style={styles.TextInputCommon}
                            onChangeText={this.handlePhone}
                            value={this.state.phone}
                            placeholder={'Phone Number'}
                            placeholderTextColor="#4bc9c1"

                        />
                        <TextInput
                            style={styles.TextInputCommon}
                            onChangeText={this.handlePassword}
                            value={this.state.password}
                            placeholder={'Password'}
                            placeholderTextColor="#4bc9c1"

                        />
                        <TextInput
                            style={styles.TextInputCommon}
                            onChangeText={this.handleConfirmPassword}
                            value={this.state.confirmpassword}
                            placeholder={'Confirm Password'}
                            placeholderTextColor="#4bc9c1"

                        />
                        {this.state.errorMessage != '' ? (
                            <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
                        ) : null}
                        <Button
                            style={styles.buttonLogin}
                            onPress={this.handleSignup}
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
