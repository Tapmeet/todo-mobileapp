import React, { PureComponent } from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Modal,
  ImageBackground,
  Keyboard, AsyncStorage,
  Alert
} from 'react-native';
import {
  heightPercentageToDP,
  PixelToDP, responsiveFontSize,
  widthPercentageToDP,
} from './PixelRatio';
import { styles } from './CustomStyleSheet';
import { Root, ActionSheet, Toast, Icon, Button } from 'native-base';
import SQLdatabase from './SQLdatabase';
import { CreateGoalDialog } from './CreateGoalDialog';
import { AddToCalendar } from './AddToCalendar';
import { CreateGoal } from './CreateGoal';;
const db = new SQLdatabase();
var BUTTONS = ['To-Do', 'Calendar', 'To-Do and Calendar', 'No Thanks'];
export class CreateTaskDialog extends PureComponent {
  static navigationOptions = {
    header: null,
  };
  state = {
    task: '',
    taskDescription: '',
    taskAddTo: '',
    addTo: [],
    addToText: '',
    addToIndex: 0,
    showPicker: false,
    sDate: '',
    repeatDaysId: '',
    repeatEndDayId: '',
    repeatEndOnDate: '',
  };
  handleTask = text => {
    this.setState({ task: text });
  };
  handleDescription = text => {
    this.setState({ taskDescription: text });
  };
  saveTask() {
    console.log(
      'save Task : ' +
      this.state.repeatDaysId +
      ',' +
      this.state.repeatEndDayId +
      ',' +
      this.state.repeatEndOnDate,
    );
    let refGoalId;
    refGoalId = this.props.navigation.getParam('GoalId');
    console.log('saveTask method is executed');
    const { task, taskDescription, addToIndex } = this.state;
    if (task === '' || taskDescription === '' || addToIndex == 0) {
      Toast.show({
        text: 'All field are mandatory.',
        buttonText: 'Hide',
      });
    } else {
      db.getTask().then(result => {
        let len = result.length;
        let data = {
          Id: len + 1,
          task: this.state.task,
          taskDescription: this.state.taskDescription,
          refGoal: refGoalId,
          refAddTo: addToIndex,
          startDate: null,
          refTaskRepeat: null,
          refTaskRepeatEnd: null,
          endOnDate: null,
          refProgress: 1,
          refPriority: 1,
          orderIndex: len,
        };
        if (addToIndex == 2 || addToIndex == 3) {
          this.props.navigation.navigate('AddToCalendar', {
            data: data,
            FromCalenderOrGoal: 'CreateGoal',
            isEdited: 'false',
          });
        } else {
          db.insertInToTasks(data)
            .then(result => {
              console.log('data saved:' + result);

              this.props.navigation.navigate('CreateGoal', {
                goalId: refGoalId,
                // TaskIconId:data.refTaskIcon,
                // goalTitle:data.goal
              });
            })
            .catch(err => {
              console.log(err);
            });
        }
      });

      console.log('data will be save');
      //db.insertInToTasks(data)
    }
  }
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log('getTaskRepeatList is executed');
    // this.setState({
    //     task : this.props.navigation.getParam("task"),
    //     taskDescription: this.props.navigation.getParam("taskDescription"),
    //     // sDate:this.props.navigation.getParam("StartDate")  ,
    //     // repeatDaysId: this.props.navigation.getParam("RepeatIndex") ,
    //     // repeatEndDayId:this.props.navigation.getParam("RepeatEndIndex"),
    //     // repeatEndOnDate:this.props.navigation.getParam("RepeatOnDate")
    // })
    // console.log("componentDidMount : "+ this.state.repeatDaysId+","+ this.state.repeatEndDayId+","+this.state.repeatEndOnDate);
    try {
      let addTo = [];
      db.getAddTo()
        .then(data => {
          addTo = data;
          this.setState({
            addTo,
            isLoading: false,
          });
          console.log(this.state.addTo);
        })
        .catch(err => {
          console.log(err);
          this.setState = {
            isLoading: true,
          };
        });
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    return (
      <View style={[styles.flexScreen, { backgroundColor: '#22DCD3' }]}>
        <Root>
          <SafeAreaView style={[styles.titlebar, {
            borderBottomWidth: 4,
            borderBottomColor: "#FFF"
          }]}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('CreateGoal')}
              style={[styles.backTouch, { paddingBottom: 25 }]}>
              <Image
                style={styles.backImageIcon}
                resizeMode={'stretch'}
                source={require('./Images/back.png')}
              />
              <Text style={[styles.backLogo, {
                // fontSize: PixelToDP(16)
                fontSize: responsiveFontSize(2.4)
              }]}>
                 Back
            </Text>
            </TouchableOpacity>
            <Text style={[styles.titleText, { paddingBottom: 25 }]}>Create Goal</Text>
          </SafeAreaView>
          <View
            style={{
              alignSelf: 'center',
              width: widthPercentageToDP(100),
              paddingTop: PixelToDP(20),
              flexDirection: 'column',
              alignItem: 'center',
              height: '75%',
              backgroundColor: '#30B3AB',
              zIndex:333

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
              ref='taskName'
              onKeyPress={(e) => {
                if (e.nativeEvent.key == "Enter" || e.nativeEvent.key == "done") {
                  // Keyboard.dismiss();
                  this.refs.taskDescription.focus()

                }
              }}
              returnKeyType={"done"}
              placeholder={'Name Your Goal:'}
              placeholderTextColor="#4bc9c1"
              onChangeText={this.handleTask}
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
                }}>
                Describe Your Goal!
            </Text>
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
                <Text style={{ width: '90%', textAlign: "center", color: "white", alignSelf: "center", fontSize: responsiveFontSize(2), fontWeight: "bold" }}>Press Here To Enter Your Goal!</Text>
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
                    'Description: Give more detail about this goal. Describe it in a S.M.A.R.T way so that it is easier to accomplish! .'
                  }
                  onChangeText={this.handleDescription}
                />
              </View>
            </View>
            <Root>
              <TouchableOpacity
                onPress={() => {
                  ActionSheet.show(
                    {
                      options: BUTTONS,
                      title: 'Add To',
                    },
                    buttonIndex => {
                      this.setState({
                        addToText: BUTTONS[buttonIndex],
                        addToIndex: buttonIndex + 1,
                      });
                    },
                  );
                }}>
                <Text
                  style={[
                    styles.addTaskTextInput,
                    {
                      borderColor: '#58c3be',
                      color: 'white',
                      textAlign: 'center',
                      backgroundColor: "#fff",
                      fontSize: responsiveFontSize(2.6),
                      borderWidth: 4,
                      height: 55,
                      paddingTop: 15,
                      shadowOffset: {
                        width: 0,
                        height: 6,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      color: '#4bc9c1',
                      elevation: 6,
                      marginTop: 15,
                      fontWeight: "bold"
                    },
                  ]}
                  placeholder={'Add To:'}
                  placeholderTextColor="#ffffff">
                  Add Task To :{this.state.addToText}
                </Text>
              </TouchableOpacity>
            </Root>
            {/*<TouchableOpacity style={{*/}
            {/*    backgroundColor:'#30B3AB',*/}
            {/*    height:PixelToDP(50),*/}
            {/*    width:PixelToDP(50),*/}
            {/*    borderRadius:PixelToDP(50),*/}
            {/*    alignItems:'center',*/}
            {/*    justifyContent:'center',*/}
            {/*    position:'absolute',*/}
            {/*    right:PixelToDP(10),*/}
            {/*    bottom:PixelToDP(10)*/}
            {/*}}*/}
            {/*                  onPress={()=>{ this.props.onClose();}}>*/}
            {/*    <Icon*/}
            {/*        name="chevron-right"*/}
            {/*        type="Feather"*/}
            {/*        style={{*/}
            {/*            fontSize: PixelToDP(30),*/}
            {/*            color: "white",*/}
            {/*        }}*/}
            {/*    />*/}
            {/*</TouchableOpacity>*/}
          </View>

          <View
            style={{
              // position: 'absolute',
              // bottom: 0,
              justifyContent: 'flex-end',
              height: '20%',
  
              // marginTop:heightPercentageToDP(90),
              width: widthPercentageToDP(100),
              alignSelf: 'center',
              backgroundColor: '#30B3AB',
              marginTop:-35
            }}>
            {/* <Button
              style={{
                width: '90%',
                alignSelf: 'center',
                height: PixelToDP(40),
                backgroundColor: 'white',
                marginBottom: PixelToDP(10),
              }}
              onPress={() => this.props.navigation.navigate('CreateGoal')}>
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
            </Button> */}
            <Button
              style={{
                width: widthPercentageToDP(90),
                alignSelf: 'center',
                height: PixelToDP(40),
                alignItems: 'center',
                marginBottom: PixelToDP(10),
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
              onPress={async () => {
                const value = await AsyncStorage.getItem('reminder');
                console.log('CreateTaskDialog, insert Date :', value);
                if (this.state.task == "" || this.state.taskDescription == "" || this.state.addToIndex == 0) {
                  Toast.show({
                    text: "All fields are mandatory",
                    buttonText: 'hide',
                    position: 'bottom'
                  })
                }
                else {
                  // if (value == "true" || this.state.addToIndex == 1 || this.state.addToIndex == 4) {
                  this.saveTask();
                  // } else {
                  //     Alert.alert("Alert",
                  //         "Reminder is not set from setting. Do you want to add task without notification",
                  //         [
                  //             {
                  //                 text: 'OK',
                  //                 onPress: () => {
                  //                     console.log('OK Pressed');
                  //                     this.saveTask();
                  //                 }
                  //             }, {
                  //             text: 'Cancel',
                  //             onPress: () => {
                  //                 console.log("Cancel Pressed");
                  //             }
                  //         }])
                  // }
                }
              }}>
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
                {this.state.addToText == "To-Do" ? "Done" : "Next"}
              </Text>
            </Button>
          </View>
        </Root>
      </View>
    );
  }
}
