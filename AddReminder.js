//https://github.com/henninghall/react-native-date-picker
import React, {PureComponent} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ImageBackground,
  Alert,
} from 'react-native';
import {Text, Button, Icon, Footer, Toast,Root} from 'native-base';
import {styles} from './CustomStyleSheet';
import {
  heightPercentageToDP,
  PixelToDP,
  widthPercentageToDP,
} from './PixelRatio';
// import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker';
import SQLdatabase from './SQLdatabase';
import NotifService from './NotifService';

const db = new SQLdatabase();
let OldReminder=[];
export class AddReminder extends PureComponent {
  static navigationOptions = {
    header: null,
  };
  setDate = (event, date) => {};
  constructor(props) {
    super(props);
    this.state = {
      isReminder: false,
      time: new Date().toLocaleTimeString(),
      day: '',
        date:new Date(),
      days: [
        {Id: '1', day: 'S', dayName: 'Sunday'},
        {Id: '2', day: 'M', dayName: 'Monday'},
        {Id: '3', day: 'T', dayName: 'Tuesday'},
        {Id: '4', day: 'W', dayName: 'Wednesday'},
        {Id: '5', day: 'T', dayName: 'Thursday'},
        {Id: '6', day: 'F', dayName: 'Friday'},
        {Id: '7', day: 'S', dayName: 'Saturday'},
      ],
    };
    this.notif = new NotifService(
      this.onRegister.bind(this),
      this.onNotif.bind(this),
    );
  }
    componentDidMount() {
        this._subscribe = this.props.navigation.addListener('didFocus', () => {
            OldReminder = this.props.navigation.getParam('Reminder');
            if(OldReminder != null)
                this.setState({
                    day: OldReminder.day
                })
            this.getReminder();
        });
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

  saveReminder = () => {
      let notifyId = new Date().toISOString();
      console.log("notifyId for reminder :",notifyId);
    console.log('saveReminder method is executed');
    let reminder = [];
      // Alert.alert("Alert","if not condition3 is true"+ OldReminder);
    if (OldReminder == null || OldReminder == undefined) {
        // Alert.alert("Alert","if condition2 is true");
      db.getReminder()
        .then(result => {
            // Alert.alert("Alert",JSON.stringify(result));
          reminder = result;
          let len = reminder.length;
          len++;
          let data = {
            Id: len,
            time: this.state.time,
            day: this.state.day,
            notifyId :notifyId
          };
          console.log(
            'AddReminder.js, time and day',
            +data.time + ' ' + data.day,
          );
            // Alert.alert("Alert",JSON.stringify(data));
          db.insertInToReminder(data)
            .then(result => {
              console.log(result);
              this.notif.checkPermission(this.handlePerm.bind(this));
              this.notif.configure(
                this.onRegister.bind(this),
                this.onNotif.bind(this),
              );
              let date= new Date();
              let sdayId = this.state.days.find(d=> d.dayName == data.day).Id - 1;
              console.log("sdayId"+ sdayId+ ","+date.getDay());
              if(date.getDay() != sdayId)
                  date.setDate(date.getDate() + ((sdayId + 7 - date.getDay()) % 7));
                console.log("dateHours :",this.state.date.getHours());
                date.setHours(this.state.date.getHours());
                date.setMinutes(this.state.date.getMinutes());
                date.setSeconds(0);
              this.notif.scheduleNotif(
                  notifyId,
                  "Conscientiousness Coach Reminder",
                  "Hey! Have you thought about your goals today? Press here to take a look",
                  date,
                  "week",
              );
              this.props.navigation.navigate('Settings');
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      let data = {
        Id: OldReminder.Id,
        time: this.state.time,
        day: this.state.day,
        notifyId:notifyId,
          isActive : 1
      };
      db.updateReminder(data.Id, data)
        .then(result => {
          console.log(result);
          this.notif.checkPermission(this.handlePerm.bind(this));
          this.notif.configure(
            this.onRegister.bind(this),
            this.onNotif.bind(this),
          );
          this.notif.cancelNotif(OldReminder.notifyId);
            let date= new Date();
            let sdayId = this.state.days.find(d=> d.dayName == data.day).Id - 1;
            console.log("sdayId"+ sdayId+ ","+date.getDay() );
            if(date.getDay() != sdayId)
                date.setDate(date.getDate() + (sdayId - date.getDay()))
            console.log("dateHours :",this.state.date.getHours());
            date.setHours(this.state.date.getHours());
            date.setMinutes(this.state.date.getMinutes());
            date.setSeconds(0);
          this.notif.scheduleNotif(
            notifyId,
            "Conscientiousness Coach",
            "Hey! Have you thought about your goals today? Please have to take a look",
             date,
             "week",
          );
          this.props.navigation.navigate('Settings');
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
  deleteReminder=()=>{
      OldReminder.isActive = 0;
      db.updateReminder(OldReminder.Id,OldReminder).then(result =>{
          this.notif.checkPermission(this.handlePerm.bind(this));
          this.notif.configure(
              this.onRegister.bind(this),
              this.onNotif.bind(this),
          );
          this.notif.cancelNotif(OldReminder.notifyId);
          this.props.navigation.navigate('Settings');
      })
  }
  render() {
    return (
      <SafeAreaView style={[styles.flexScreen, {backgroundColor: '#30B3AB'}]}>
        <View
          style={{
            width: widthPercentageToDP(90),
            alignSelf: 'center',
            alignItems: 'flex-end',
            marginTop: PixelToDP(30),
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#325859',
              height: PixelToDP(40),
              width: PixelToDP(40),
              borderRadius: PixelToDP(100),
            }} onPress={this.deleteReminder.bind(this)}>
            <Icon
              name="trash-2"
              type="Feather"
              style={{
                fontSize: PixelToDP(20),
                padding: PixelToDP(10),
                color: 'white',
              }}
            />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            textAlign: 'center',
            color: 'white',
            fontSize: PixelToDP(14),
            marginTop: PixelToDP(20),
          }}>
          Select Reminder time and days of the weak
        </Text>
        <View
          style={{
            width: widthPercentageToDP(90),
            alignSelf: 'center',
            alignItems: 'center',
              justifyContent:'space-between',
            marginTop: PixelToDP(10),
          }}>
          <FlatList
            data={this.state.days}
            horizontal={true}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={
                  item.dayName == this.state.day
                    ? styles.dailyRemainderDayActive
                    : styles.dailyRemainderDay
                }
                onPress={() =>
                  this.setState({
                    day: item.dayName,
                  })
                }>
                <Text
                  style={
                    item.dayName == this.state.day
                      ? styles.dailyRemainderTextDayActive
                      : styles.dailyRemainderTextDay
                  }>
                  {item.day}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <View
          style={{
            width: widthPercentageToDP(90),
            alignSelf: 'center',
            marginTop: PixelToDP(30),
          }}>
          <DatePicker
            mode={'time'}
            // locale='fr'
            date={this.state.date}
            // maximumDate={new Date().setFullYear(new Date().getFullYear() +1)}
            // minimumDate={new Date('2019-01-01')}
            onDateChange={date =>
            {
                console.log("date :",date);
                this.setState({
                    date,
                    time: date.toLocaleTimeString(),
                },()=>{
                    console.log("time :",this.state.time);
                    console.log("state date :",this.state.date);
                })
            }
            }
            fadeToColor={'black'}
            textColor={'#ffffff'}
            // textSize={PixelToDP(30)}
            style={{
              width: widthPercentageToDP(90),
            }}
            // customStyles={{
            // //     dateInput:{
            // //         fontSize:PixelToDP(20),
            // //         borderWidth: 10,
            // //         paddingRight: 25,
            // //     },
            //     placeholder: {
            //         fontSize: PixelToDP(20),
            //         color: 'red'
            //     }
            // }}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: widthPercentageToDP(90),
            alignSelf: 'center',
          }}>
          <Button
            style={{
              width: '100%',
              height: PixelToDP(40),
              backgroundColor: 'white',
              marginBottom: PixelToDP(10),
            }}
            onPress={() => this.props.navigation.navigate('Settings')}>
            <Text
              style={{
                color: '#325859',
                width: '100%',
                fontSize: PixelToDP(18),
                textAlign: 'center',
                textTransform: 'uppercase',
                textAlignVertical: 'center',
              }}>
              Cancel
            </Text>
          </Button>
            <Root>
          <Button
            style={{
              width: widthPercentageToDP(90),
              alignSelf: 'center',
              height: PixelToDP(40),
              alignItems: 'center',
              backgroundColor: '#325859',
              marginBottom: PixelToDP(10),
            }}
            onPress={()=>{
                if(this.state.day == "")
                {
                    Toast.show({
                                text: 'Please select day',
                                buttonText: 'Hide',
                                position: 'bottom',
                            });
                }
                else
                  this.saveReminder()
            }}>
            <Text
              style={{
                color: 'white',
                width: '100%',
                textTransform: 'uppercase',
                fontSize: PixelToDP(18),
                textAlign: 'center',
                textAlignVertical: 'center',
              }}>
              Done
            </Text>
          </Button>
            </Root>
        </View>
      </SafeAreaView>
    );
  }
}
