import React, { PureComponent } from "react";
import {
    View,
    TouchableOpacity,
    TextInput,
    Modal, StatusBar,
    ImageBackground,
    AsyncStorage,
    Keyboard,
    SafeAreaView,
    FlatList,
    Image
} from 'react-native';
import {Text, Icon, Card, Root,Toast} from 'native-base';
import {styles} from "./CustomStyleSheet";
import {heightPercentageToDP, PixelToDP, responsiveFontSize, widthPercentageToDP} from './PixelRatio';
import {Code} from './InsertInToDatabase';
import {NavigationActions, StackActions} from 'react-navigation';

export class EnterCode extends PureComponent {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            code: '',
            keyboardButtons: [{key:'1'},
                {key:'2'},
                {key:'3'},
                {key:'4'},
                {key:'5'},
                {key:'6'},
                {key:'7'},
                {key:'8'},
                {key:'9'},
                ]
        }
    }
    onNumberKeyPress=(key)=>{
        this.setState({
                code: this.state.code + key
            }
        ,()=>console.log("code :",this.state.code))
    }
    onDelete=()=>{
        const length = this.state.code.length;
        const newCode = this.state.code.substring(0,length-1);
        this.setState({
                code: newCode.toString()
            }
        ),()=>console.log("code :",this.state.code)
    }
    onSubmit= async()=> {
            let code = this.state.code;
            console.log("onSubmit method is executed", code);
            if (code != "" && code != null) {
                if (code == Code.code) {
                    await AsyncStorage.setItem('isLogin', 'true');
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({routeName: 'Home'})],
                    });
                    this.props.navigation.dispatch(resetAction);
                } else {
                    Toast.show({
                        text: "Please Enter right code",
                        buttonText: 'hide',
                        position: 'bottom'
                    })
                }
        }
    }
    componentDidMount () {
    }
    render() {
        const {code} = this.state;
        return (
            <View style={[styles.flexScreen, {
                backgroundColor:'#60C8C1',
            }]}>
                <StatusBar
                    backgroundColor="#22DCD3"
                    barStyle="light-content"
                    hidden={true}
                />
                <Root>
                    <SafeAreaView style={{
                        height:heightPercentageToDP(40),
                        justifyContent:'center',
                    }}>
                        <Card style={[styles.enterCodeLogoBackground,styles.shadow,{
                            elevation:PixelToDP(10)
                        }]}>
                            <View style={[styles.enterCodeLogoBackground,{
                                backgroundColor:'#5ACAC2',
                                borderWidth:PixelToDP(5),
                                borderRadius:widthPercentageToDP(20),
                                borderColor:'#3E9F9A',
                            }]}>
                    <Image source={require('./Images/logo.png')}
                           resizeMode={'contain'}
                           style={{
                               alignSelf:'center',
                               width:widthPercentageToDP(16),
                               height:widthPercentageToDP(18),
                               // backgroundColor:'red',
                               // borderColor:'#3FB5AB',
                               // borderWidth:PixelToDP(2),
                               // borderRadius:widthPercentageToDP(25),
                           }}
                    />
                            </View>
                        </Card>
                    </SafeAreaView>
                       <TextInput
                           placeholder={'Enter Passcode'}
                           style={[styles.shadow,{
                           color:'black',
                           textAlign:'center',
                           marginTop:heightPercentageToDP(5),
                           width:widthPercentageToDP(70),
                           alignSelf:'center',
                           paddingLeft:PixelToDP(10),
                           paddingRight:PixelToDP(10),
                           borderWidth:PixelToDP(5),
                           borderColor:'#3FB5AB',
                           borderRadius: PixelToDP(20),
                           height: PixelToDP(41),
                           backgroundColor:'#ffffff',
                        }]}
                                   value={code}
                                   onFocus={()=>Keyboard.dismiss()}
                                   onChangeText={(text)=>this.setState({
                                       code:text
                                   })}
                        />
                        <View style={{
                            width:widthPercentageToDP(80),
                            alignSelf:'center',
                            alignItems:'center',
                            position:'absolute',
                            bottom:PixelToDP(20),
                        }}>
                        <FlatList data={this.state.keyboardButtons}
                                  keyExtractor={(item, index) => index.toString()}
                                  numColumns={3}
                                  horizontal={false}
                                  renderItem={({item}) =>
                                      <TouchableOpacity style={{
                                          width:widthPercentageToDP(25),
                                          alignItems:'center',
                                          height:widthPercentageToDP(18),
                                      }}
                                         onPress={()=>this.onNumberKeyPress(item.key)}
                                      >
                                          <Text style={{
                                              color:'white',
                                              fontSize:responsiveFontSize(3.5),
                                              fontWeight:'bold'
                                          }}>{item.key}</Text>
                                      </TouchableOpacity>
                                  }
                                  />
                            <View style={{
                                width:'95%',
                                flexDirection:'row',
                                height:widthPercentageToDP(15),
                                marginTop:PixelToDP(-10),
                                justifyContent:'center',
                            }}>
                                <TouchableOpacity style={{
                                    width:widthPercentageToDP(25),
                                    alignItems:'center',
                                    height:widthPercentageToDP(20),
                                }}
                                   onPress={this.onDelete}
                                >
                                    <Card style={styles.cardStyleforCode}>
                                        <Image
                                            source={require('./Images/delete.png')}
                                            resizeMode={'cover'}
                                            style={styles.enterCodeKeyImage}
                                        />
                                    </Card>
                                </TouchableOpacity>
                                <TouchableOpacity style={{
                                    width:widthPercentageToDP(25),
                                    alignItems:'center',
                                    justifyContent:'center',
                                }}
                                   onPress={()=>this.onNumberKeyPress(0)}
                                >
                                    <Text style={{
                                        color:'white',
                                        fontSize:responsiveFontSize(3.5),
                                        fontWeight:'bold'
                                    }}>0</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.shadow,{
                                    width:widthPercentageToDP(25),
                                    alignItems:'center',
                                    height:widthPercentageToDP(20),
                                }]}  onPress={this.onSubmit}>
                                    <Card style={styles.cardStyleforCode}>
                                        <Image
                                            source={require('./Images/submit.png')}
                                            resizeMode={'cover'}
                                            style={styles.enterCodeKeyImage}
                                        />
                                    </Card>
                                </TouchableOpacity>
                            </View>
                        </View>
                </Root>
            </View>

        );
    }
}
