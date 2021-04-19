import React, { Component } from "react";
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
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addUser } from "./redux/UserActions"
import { heightPercentageToDP, PixelToDP, responsiveFontSize, widthPercentageToDP } from './PixelRatio';
const db = new SQLdatabase();
//await AsyncStorage.setItem('isLogin', 'true');
function mapDispatchToProps(dispatch) {
    return {
        addUser: userinfo => dispatch(addUser(userinfo))
    };
}
class Login extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMessage: ''

        };
        this.handleLogin = this.handleLogin.bind(this);
    }
    ValidateEmail = (mail) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
    };
    handleEmail = text => {
        this.setState({ email: text });
    };
    handlePassword = text => {
        this.setState({ password: text });
    };

    handleLogin = () => {
        this.setState({ errorMessage: '' });
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
            return false;
        }
        fetch(`http://192.168.18.22:2000/api/auth/login`, {
            method: "POST",
            headers: {
                Accept: "*/*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                // userData = userInfo => dispatch({ type: "LOGGED_IN_USER", payload: userInfo })
                // console.log(response);
                this.props.addUser({ "id": 1, 'token':response.token})
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
                            onPress={() => this.props.navigation.navigate('JournalListingsScreen')}
                            style={{
                                alignItems: 'center',
                                width: widthPercentageToDP(20),
                            }}>
                            {/* <Image
                                style={styles.backImageIcon}
                                resizeMode={'stretch'}
                                source={require('./Images/back.png')}
                            /> */}
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
                        <Text style={styles.loginTitle}>Welcome!</Text>
                        <Text style={[styles.loginText]}>Sign in to Continue</Text>
                        <TextInput
                            style={styles.TextInputCommon}
                            onChangeText={this.handleEmail}
                            value={this.state.email}
                            placeholder={'Email'}
                            placeholderTextColor="#4bc9c1"

                        />
                        <TextInput
                            style={styles.TextInputCommon}
                            onChangeText={this.handlePassword}
                            value={this.state.password}
                            placeholder={'Password'}
                            placeholderTextColor="#4bc9c1"
                            secureTextEntry

                        />
                        {this.state.errorMessage != '' ? (
                            <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
                        ) : null}
                        <Button
                            style={styles.buttonLogin}
                            onPress={this.handleLogin}
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
                                Login
                            </Text>
                        </Button>
                        <Text style={styles.loginSignup}>
                            Don’t have an account? <Text style={styles.loginSignupText} onPress={() => this.props.navigation.navigate('SignupScreen')}>Sign Up Now!</Text>
                        </Text>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}
const LoginScreen = connect(
    null,
    mapDispatchToProps
  )(Login);
  
export default LoginScreen;

//export default connect(null, mapDispatchToProps)(LoginScreen); 