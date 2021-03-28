import React, { PureComponent } from "react";
import {
    View,
    Image,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    ImageBackground, ActivityIndicator,
} from 'react-native';
import {Text} from 'native-base';
import {styles} from "./CustomStyleSheet";
import {heightPercentageToDP, PixelToDP, responsiveFontSize, widthPercentageToDP} from './PixelRatio';
import SQLdatabase from './SQLdatabase';
import {insertTORepeat,TaskRepeat} from './InsertInToDatabase';

const db = new SQLdatabase();
export class Repeat extends PureComponent {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = {
            isLoading:true,
            isTaskStartDateSelected: false,
            repeatDay: []
        }
    }
    componentDidMount() {
        this._subscribe = this.props.navigation.addListener('didFocus', () => {
            this.getTaskRepeatList();
        });
    }
    getTaskRepeatList() {
        console.log('getTaskRepeatList is executed');
        try {
            let repeatDay = [];
            db.getTaskRepeat().then((data) => {
                repeatDay = data;
                if(repeatDay.length <= 0){
                    insertTORepeat(()=>{
                        db.getTaskRepeat().then(result =>{
                            repeatDay = result;
                            this.setState({
                                repeatDay,
                                isLoading: false,
                            },()=>console.log(this.state.repeatDay));
                        })
                    })
                }
                else
                {
                    this.setState({
                        repeatDay,
                        isLoading: false,
                    },()=> console.log(this.state.repeatDay));
                }

            }).catch((err) => {
                console.log(err);
                this.setState = {
                    isLoading: true
                }
            })
        }catch (e){
            console.log(e);
        }
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
                    <SafeAreaView style={styles.titlebar
                    }>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("AddToCalendar")}
                                          style={[styles.backTouch,{
                                              width: '35%',
                                          }]}>
                            <Image style={styles.backImageIcon} resizeMode={'stretch'} source={require('./Images/back.png')}/>
                            <Text style={[styles.backLogo,{
                                fontSize:responsiveFontSize(1.8),
                                width:widthPercentageToDP(35)
                            }]}>Add To Calendar</Text>
                        </TouchableOpacity>
                        <Text style={[styles.titleText,{
                            width: '20%',
                        }]}>Repeat</Text>
                        <View style={[styles.titleRightView,{
                            width: '40%',
                        }]}/>
                    </SafeAreaView>
                    {/*{this.state.isLoading ? (*/}
                    {/*    <View*/}
                    {/*        style={{*/}
                    {/*            position: "absolute",*/}
                    {/*            left: 0,*/}
                    {/*            right: 0,*/}
                    {/*            top: 0,*/}
                    {/*            bottom: 0,*/}
                    {/*            alignItems: "center",*/}
                    {/*            justifyContent: "center",*/}
                    {/*            zIndex: 1*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        <ActivityIndicator size='large' color='black'/>*/}
                    {/*    </View>*/}
                    {/*):(*/}
                    <View style={{width:widthPercentageToDP(90),
                        alignSelf:'center'}}>
                        <FlatList
                            data={TaskRepeat}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item}) =>
                                <TouchableOpacity style={{
                                    flexDirection: 'row',
                                    width: '100%',
                                    alignItems:'center',
                                    height: PixelToDP(55),
                                    borderBottomColor: '(rgba(255, 255, 255, 0.29)',
                                    borderBottomWidth: PixelToDP(1),
                                }}
                                                  onPress={() => this.props.navigation.navigate("AddToCalendar",{
                                                      comeFrom : 'Repeat',
                                                      RepeatDay:item.title,
                                                      RepeatDayIndex:item.Id,
                                                      interval : item.interval
                                                  })}>
                                    <Text style={styles.settingText}>{item.title}</Text>
                                </TouchableOpacity>
                            }/>
                    </View>
                        {/*)}*/}
                </ImageBackground>
            </View>
        );
    }
}
