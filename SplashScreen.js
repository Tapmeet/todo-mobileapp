//https://github.com/oblador/react-native-progress
import React, { PureComponent } from "react";
import {
    View,
    Image,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    ImageBackground,
    ScrollView, AsyncStorage, StatusBar,
} from 'react-native';
import {styles} from "./CustomStyleSheet";
import {StackActions,NavigationActions} from 'react-navigation';
import {widthPercentageToDP} from './PixelRatio';
export class SplashScreen extends PureComponent {
    static navigationOptions = {
        header: null
    }
    componentDidMount(){
       this.checkLogin();
    }
    checkLogin=async()=>{
        let isLogin = await AsyncStorage.getItem('isLogin');
        console.log('checkLogin method is executed',isLogin);
        if(isLogin=='true'){
            this.timeoutHandle = setTimeout(() => {
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Home' })],
                });
                this.props.navigation.dispatch(resetAction);
            },2000);
        }
        else{
            this.timeoutHandle = setTimeout(() => {
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'EnterCode' })],
                });
                this.props.navigation.dispatch(resetAction);
            },2000);
        }
    }
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.flexScreen}>
                <StatusBar
                    backgroundColor="#22DCD3"
                    barStyle="light-content"
                    hidden={true}
                />
                <ImageBackground
                    style={{
                        alignItems:'center',
                        width: '100%',
                        justifyContent:'center',
                        height: '100%',
                    }}l
                    source={require('./Images/gradient.png')}
                    resizeMode={"stretch"}
                >
                    <View style={{
                        alignSelf:'center',
                        height:widthPercentageToDP(70),
                        width:widthPercentageToDP(70)
                    }}>
                        <Image style={{
                            alignSelf:'center',
                            height:widthPercentageToDP(70),
                            width:widthPercentageToDP(70)
                        }} source={require('./Images/splashLogo.png')}/>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}
