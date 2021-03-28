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
import DatePicker from 'react-native-date-picker';
import {insertTOTaskRepeatEnd,TaskRepeatEnd} from './InsertInToDatabase';

const db = new SQLdatabase();
var title,id
export class RepeatEnd extends PureComponent {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading:true,
            endDateFormat:'',
            isOnDateSelected: false,
            repeatEndDays: [],
            redate : new Date(),
            repeatEndDay:'',
            repeatEndDayIndex:'',
        }
        console.log("isOnDateSelected: "+ this.state.isOnDateSelected)
    }
    componentDidMount() {
        this._subscribe = this.props.navigation.addListener('didFocus', () => {
            // this.getTaskRepeatList();
        });
    }
    // onSelect =(t,i)=>{
    //     console.log("onSelect Method executed")
    //     if(i == 2) {
    //         this.setState({
    //             isOnDateSelected: true
    //         })
    //     }else {
    //         title = t,
    //             id= i;
    //         this.AddDetail();
    //     }
    // }
    // AddDetail = ()=>{
    //     console.log("AddDetail Method executed")
    //     this.props.navigation.navigate("AddToCalendar",
    //         {
    //             RepeatEndDay: title,
    //             RepeatEndDayIndex: id,
    //             RepeatOnDate : this.state.date.toLocaleString()
    //         })
    // }
    getTaskRepeatList() {
        console.log('getTaskRepeatList method is executed');
        try {
            let repeatEndDays = [];
            db.getTaskRepeatEnd().then((data) => {
                repeatEndDays = data;
                if(repeatEndDays.length <= 0){
                    insertTOTaskRepeatEnd(()=>{
                        db.getTaskRepeatEnd().then(result=>{
                            repeatEndDays = result;
                            this.setState({
                                repeatEndDays,
                                isLoading: false,
                            },()=>console.log(this.state.repeatEndDay));
                        })
                    })
                }
                else
                {
                    this.setState({
                        repeatEndDays,
                        isLoading: false,
                    },()=>console.log(this.state.repeatEndDay));
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

    setDate(date){
        let d = date.getFullYear()+"-"+("0" + (date.getMonth() + 1)).slice(-2)+"-"+("0" + date.getDate()).slice(-2)+" "+date.toLocaleTimeString();
        this.setState({
            redate: date,
            endDateFormat : d
        })
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
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("AddToCalendar")} style={[styles.backTouch,{width:widthPercentageToDP(30)}]}>
                            <Image style={styles.backImageIcon} resizeMode={'stretch'} source={require('./Images/back.png')}/>
                            <Text style={[styles.backLogo,{fontSize:responsiveFontSize(2)}]}>Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.titleText}>Repeat End</Text>
                        <TouchableOpacity style={{
                            width:'20%',
                            marginLeft:'10%',
                            alignItems:'center'
                        }}
                                          onPress={()=>{
                                              console.log("end Date :",this.state.redate);

                                              this.props.navigation.navigate("AddToCalendar",
                                                  {
                                                      comeFrom : "RepeatEnd",
                                                      RepeatEndDay: this.state.repeatEndDay,
                                                      RepeatEndDayIndex: this.state.repeatEndDayIndex,
                                                      RepeatEndOnDateFormat: this.state.endDateFormat,
                                                      RepeatEndOnDate : this.state.redate
                                                  })
                                          }}
                        >
                            <Text style={{
                                // textTransform:'uppercase',
                                fontSize:PixelToDP(16),
                                color:'white',
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                // height:'100%',

                            }}>Set</Text>
                        </TouchableOpacity>
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
                            data={TaskRepeatEnd}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item}) =>
                                <TouchableOpacity style={{
                                    flexDirection: 'row',
                                    width: '100%',
                                    alignItems: 'center',
                                    height: PixelToDP(55),
                                    borderBottomColor: '(rgba(255, 255, 255, 0.29)',
                                    borderBottomWidth: PixelToDP(1),
                                }}
                                                  onPress={ ()=> {
                                                      if(item.Id === 2){
                                                          this.setDate(this.state.redate)
                                                      }
                                                      this.setState({
                                                      repeatEndDay:item.title,
                                                      repeatEndDayIndex:item.Id
                                                  }) }
                                                     }>
                                    <Text style={styles.settingText}>{item.title}</Text>
                                </TouchableOpacity>
                            }/>
                    </View>
                    {/*)}*/}
                {(this.state.repeatEndDayIndex === 2) &&
                <View style={{
                    width:widthPercentageToDP(50),
                    // height:heightPercentageToDP(0),
                    alignSelf:'center',
                    // backgroundColor:'red',
                    alignItems:'center'
                }}>
                    <DatePicker
                        mode={'datetime'}
                        date={this.state.redate}
                        // maximumDate={new Date().setFullYear(new Date().getFullYear() +1)}
                        // minimumDate={new Date('2019-01-01')}
                        locale='en'
                        format="YYYY-MM-DD HH:mm"
                        onDateChange={(date)=>this.setDate(date)}
                        fadeToColor={'none'}
                        textColor={'#ffffff'}
                    />
                </View>
                }
                </ImageBackground>
            </View>
        );
    }
}
