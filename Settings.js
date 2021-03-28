import React, { PureComponent } from "react";
import {
    View,
    Image,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    ActivityIndicator,
    ImageBackground,
    AsyncStorage,
    Alert
} from "react-native";
import {Text,Button,Icon} from 'native-base';
import {styles} from "./CustomStyleSheet";
import {heightPercentageToDP, PixelToDP, responsiveFontSize, widthPercentageToDP} from './PixelRatio';
import {Home} from './Home';
import SQLdatabase from './SQLdatabase';
import {setNotification,CancelScheduledNotification} from './setNotification';
import {parse} from 'react-native-svg';
import NotifService from './NotifService';

const db = new SQLdatabase();
export class Settings extends PureComponent {
    static navigationOptions={
        header:null
    }
    state = {
        isReminder:false,
        isReminderLoading:true,
        Reminder: []
    }
    constructor(props) {
        super(props);
        this.notif = new NotifService(
            this.onRegister.bind(this),
            this.onNotif.bind(this),
        );
    }
    onRegister(token) {
        console.log('Registered !', JSON.stringify(token));
        console.log(token);
        this.setState({registerToken: token.token, gcmRegistered: true});
    }
    onNotif(notif) {
        console.log(notif);
        console.log(notif.title, notif.message);
    }
    handlePerm(perms) {
        console.log('Permissions', JSON.stringify(perms));
    }
    componentDidMount() {
        this._subscribe = this.props.navigation.addListener('didFocus', () => {
            // this.insertTaskIcon();
            this.getReminderList();
            this.getReminder();
        });
    }
    // getReminder = async()=>{
    //     const value = await AsyncStorage.getItem('reminder');
    //     console.log('AddToCalendar, insert Date :', value);
    //     if(value == "true")
    //     {
    //         this.setState({
    //             isReminder : true
    //         });
    //     }
    //     else{
    //         this.setState({
    //             isReminder : false
    //         });
    //     }
    // }
    getReminderList = async()=>{
        this.setState({
            isReminderLoading:true
        })
        console.log('getReminder method is executed');
        let Reminder = [];
        db.getReminder().then((result) => {
            result.forEach(r=>{
                if(r.isActive == 1)
                    Reminder.push(r);
            })
            this.setState({
                Reminder,
                isReminderLoading:false
            })
            console.log('AddReminder.js, time and day', +Reminder.time + ' ' + Reminder.day);
        }).catch((err) => {
            console.log(err);
        });
    }
    // setReminder=async()=>{
    //     this.setState({
    //         isReminder:!this.state.isReminder
    //     },async ()=>{
    //         // Alert.alert("alert", this.state.isReminder.toString());
    //         try {
    //             await AsyncStorage.setItem("reminder", this.state.isReminder.toString());
    //             if(this.state.isReminder == false){
    //                 CancelScheduledNotification(this.notif);
    //             }
    //             else
    //                 setNotification(this.notif);
    //         } catch (e) {
    //             alert(e);
    //             // saving error
    //         }
    //     });
    // }
    setTime=(t)=>{
        let tf = t.split(":");
        let format = tf[2].split(" ");
        console.log("setTime split :",tf);
        console.log("format[1] :",format[1]);
        if(format[1]==undefined) {
            if (tf[0] > 12) {
                return (tf[0] - 12) + ":" + tf[1] + " " + "PM";
            } else if (tf[0] == 12) {
                return tf[0] + ":" + tf[1] + " " + "PM";
                return tf[0] + ":" + tf[1] + " " + "PM";
            } else {
                return tf[0] + ":" + tf[1] + " " + "AM";
            }
        }
        else{
            return (tf[0]+":"+tf[1]+" "+format[1]);
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
                        <TouchableOpacity onPress={()=> this.props.navigation.navigate("Home")} style={styles.backTouch}>
                            <Image style={styles.backImageIcon} resizeMode={'stretch'} source={require('./Images/back.png')}/>
                            <Text style={styles.backLogo}>CC</Text>
                        </TouchableOpacity>
                        <Text style={[styles.titleText,{textTransform:'uppercase'}]}>Settings</Text>
                        <View style={styles.titleRightView}/>
                    </SafeAreaView>
                    <View style={{
                        marginTop:20,
                        width:widthPercentageToDP(90),
                        alignSelf:'center',
                        flex:1
                    }}>
                        <Text style={styles.settingHeading}>Daily Reminder </Text>
                        {this.state.isReminderLoading ?
                            <ActivityIndicator/>
                            :
                        <View>
                            <FlatList
                                data={ this.state.Reminder}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={ ({item}) =>
                                    <TouchableOpacity style={{
                                    flexDirection:'row',
                                        alignItems:'center',
                                        borderBottomColor:'(rgba(255, 255, 255, 0.29)',
                                        borderBottomWidth:PixelToDP(1),
                                        height:PixelToDP(40)
                                    }} onPress={()=>this.props.navigation.navigate("AddReminder",{Reminder:item})}>
                                        <Text style={{
                                            color:'white',
                                            // fontSize:PixelToDP(15),
                                            fontSize:responsiveFontSize(2),
                                            width:widthPercentageToDP(60),
                                            // height:'100%',
                                            // textAlignVertical: 'center'
                                        }}>
                                            {this.setTime(item.time)}
                                            {/*{item.time}*/}
                                        </Text>
                                        <Text style={{
                                            color:'white',
                                            // fontSize:PixelToDP(15),
                                            fontSize:responsiveFontSize(2),
                                            // width:widthPercentageToDP(23),
                                            position:'absolute',
                                            right:PixelToDP(25)
                                            // height:'100%',
                                            // textAlignVertical: 'center'
                                        }}>{item.day}</Text>
                                        <Icon
                                            name="chevron-right"
                                            type="Feather"
                                            style={{
                                                // fontSize: PixelToDP(25),
                                                fontSize:responsiveFontSize(3),
                                                color: "white",
                                                alignSelf:'center',
                                                alignItems :'center',
                                                justifyContent:'center',
                                                position:'absolute',
                                                right:PixelToDP(5)
                                            }}
                                        />
                                    </TouchableOpacity>

                                }
                            />

                        </View>
                        }
                        <TouchableOpacity style={{
                            flexDirection:'row',
                            marginTop:PixelToDP(10)
                        }} onPress={()=>this.props.navigation.navigate("AddReminder")}
                        >
                            <Icon
                                name="plus"
                                type="Feather"
                                style={{
                                    // fontSize: PixelToDP(20),
                                    fontSize:responsiveFontSize(2.5),
                                     paddingRight:PixelToDP(10),
                                    color: "white",
                                    alignSelf:'center'
                                }}
                            />
                             {/*<Icon.plus/>*/}
                            <Text style={styles.settingText}>Add Reminder</Text>
                        </TouchableOpacity>
                        {/*<Text style={styles.settingHeading}>CALENDAR EVENT REMINDER</Text>*/}
                        {/*<TouchableOpacity style={{*/}
                        {/*    flexDirection:'row',*/}
                        {/*    justifyContent:'space-between',*/}
                        {/*}} onPress={this.setReminder.bind(this)}>*/}
                        {/*<Text style={styles.settingText}>Reminder</Text>*/}
                        {/*    <View style={{*/}
                        {/*        borderColor:'black',*/}
                        {/*        borderWidth:PixelToDP(1),*/}
                        {/*        width:PixelToDP(25),*/}
                        {/*        height:PixelToDP(25),*/}
                        {/*        justifyContent:'center'*/}
                        {/*    }}>*/}
                        {/*        {(this.state.isReminder)&&*/}
                        {/*        <Icon*/}
                        {/*            name="check"*/}
                        {/*            type="Feather"*/}
                        {/*            style={{*/}
                        {/*                color: "white",*/}
                        {/*                alignSelf:'center',*/}
                        {/*                fontSize:PixelToDP(20)*/}
                        {/*            }}*/}

                        {/*        />}*/}
                        {/*    </View>*/}
                        {/*</TouchableOpacity>*/}
                        <Text style={styles.settingHeading}>General</Text>
                        <TouchableOpacity style={{
                            // borderBottomColor:'(rgba(255, 255, 255, 0.29)',
                            // borderBottomWidth:1,
                            height:PixelToDP(30)
                        }}>
                        <Text style={styles.settingText}>
                            Rate App
                        </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            // borderBottomColor:'(rgba(255, 255, 255, 0.29)',
                            // borderBottomWidth:1,
                            height:PixelToDP(30)
                        }}>
                        <Text style={styles.settingText}>
                            Share App
                        </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            // borderBottomColor:'(rgba(255, 255, 255, 0.29)',
                            // borderBottomWidth:1,
                            height:PixelToDP(30)
                        }} onPress={() => this.props.navigation.navigate('AboutOne',{
                            comeFrom: 'Settings',
                        })}>
                        <Text style={styles.settingText}>
                            About App
                        </Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}
