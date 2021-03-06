import React, { PureComponent } from 'react';
import { Text, Toast } from 'native-base';

import {
  View,
  Image,
  Keyboard,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ImageBackground,
  Alert,
  ActivityIndicator,
  StyleSheet,
  StatusBar, AsyncStorage,
} from 'react-native';
import { Button, Root } from 'native-base';
import { styles } from './CustomStyleSheet';
import {
  heightPercentageToDP,
  PixelToDP,
  widthPercentageToDP, 
  responsiveFontSize
} from './PixelRatio';
import { AddTaskDialog } from './AddTaskDialog';
import { CreateGoalDialog } from './CreateGoalDialog';
import SQLdatabase from './SQLdatabase';
import NotifService from './NotifService';
import { setNotification } from './setNotification';
import { EnterCode } from './EnterCode';
import { Code } from './InsertInToDatabase';

const db = new SQLdatabase();

export class Home extends PureComponent {
  static navigationOptions = {
    header: null,
  };

  constructor(props, context) {
    super(props, context);
    console.log("constructor is executed");
    this.state = {
      CreateGoalDialogVisible: false,
      AddCodeVisible: false,
      GoalId: 0,
      Goal: [],
      Title: '',
      IconId: '',
      Icon: '',
      customImg: 0,
      isGoalsLoading: true,

    };
    this.notif = new NotifService(
      this.onRegister.bind(this),
      this.onNotif.bind(this),
    );
    setNotification(this.notif);
  }
  checkLogin = async () => {
    let isLogin = await AsyncStorage.getItem('isLogin');
    console.log('checkLogin method is executed', isLogin);
    if (isLogin == 'true') {
      this.setState({
        AddCodeVisible: false
      }, () => console.log('isLogin', isLogin))
    }
    else {
      this.setState({
        AddCodeVisible: true
      }, () => console.log('isLogin', isLogin))
    }
  }

  onRegister(token) {
    console.log('Registered !', JSON.stringify(token));
    console.log(token);
    this.setState({ registerToken: token.token, gcmRegistered: true });
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
      console.log("componentDidMount is called");
      this.checkLogin();
      this.getGoal();
    });
  }

  getGoal() {
    this.setState({
      isGoalsLoading: true,
    });
    console.log("getGoal is called");
    let goal = [];
    db.getGoals()
      .then(goals => {
        db.getTaskIcon().then(task => {
          console.log("getGoal, goal length :", goal.length);
          goals.forEach(g => {
            if (g.isActive == 1 && g.isCompleted == 0) {
              console.log("length of goal:", goal.length);
              if (goal.length < 8) {
                goal.push({
                  Id: g.Id,
                  title: g.goal,
                  AccomplishedPercentage: g.accomplishedPercentage,
                  taskIconId: g.refTaskIcon,
                  icon: task.find(t => t.Id == g.refTaskIcon && t.isActive == 1)
                    .icon,
                  customImg: task.find(
                    t => t.Id == g.refTaskIcon && t.isActive == 1,
                  ).customImage,
                });
              }
            }
          });
          this.setState({
            Goal: goal,
            isGoalsLoading: false,
          }, () => {
            console.log("this.state.isGoalLoading :", this.state.isGoalLoading);
            this.forceUpdate();
          });

        });
      })
      .catch(err => {
        console.log(err);
        this.setState = {
          isGoalsLoading: true,
        };
      });
  }

  setAngle(id) {
    let len = this.state.Goal.length;
    let degree = 360 / len;
    let rotateAngle = id * degree;
    console.log('degree of Id' + id + ': ' + rotateAngle);
    console.log('string degree:' + rotateAngle + 'deg');
    return rotateAngle.toString();
  }

  render() {
    const { Goal } = this.state;
    return (
      <View style={styles.flexScreen}>
        <StatusBar
          backgroundColor="#22DCD3"
          barStyle="light-content"
          hidden={true}
        />
        <Root>
          <ImageBackground
            style={{
              width: widthPercentageToDP(100),
              height: '100%',
              backgroundColor: "#22DCD3"
            }}
            source={require('./Images/gradient.png')}
            resizeMode={'stretch'}
          >
            <SafeAreaView style={styles.titlebarHome}>
              <TouchableOpacity
                //onPress={() => this.props.navigation.navigate('video')}
                style={{
                  alignItems: 'center',
                  width: widthPercentageToDP(20),
                }}>
                <Image
                style={{
                    height: responsiveFontSize(4),
                    width: responsiveFontSize(4)
                }}
                resizeMode={'contain'}
                source={require('./Images/video-camera.png')}
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
                width: widthPercentageToDP(80),
                height: 'auto',
                marginTop: PixelToDP(9),
                alignSelf: 'center',
                marginBottom: PixelToDP(30),

              }}>
              <Text style={styles.homeText}>
                Conscientiousness refers to the ability to organize yourself to achieve your goals and make change in your world.
            </Text>
              <Button
                transparent
                style={styles.homeButton}
                onPress={() => this.props.navigation.navigate('AboutOne', {
                  comeFrom: "Home",
                })}>
                <Text
                  style={styles.homeButtonText}>
                  Press Here to Read More
              </Text>
              </Button>
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View
                style={{
                  width: widthPercentageToDP(65),
                  height: widthPercentageToDP(65),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: widthPercentageToDP(40),
                }}>
                <View
                  style={{
                    width: widthPercentageToDP(69),
                    height: widthPercentageToDP(69),
                    borderRadius: widthPercentageToDP(40),
                    borderWidth: PixelToDP(6),
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: '#fff',
                    flexDirection: 'row',
                  }}>
                  <View
                    style={styles.homeRoundButtons}>
                    <TouchableOpacity
                      style={{
                        width: '100%',
                        height: 'auto',
                        alignItems: 'center',
                        paddingBottom: 10,
                      }}
                      onPress={() => this.props.navigation.navigate('calender')}>
                      <Image
                        style={{
                          alignSelf: 'center',
                          height: PixelToDP(40),
                          width: PixelToDP(40),
                        }}
                        resizeMode={'contain'}
                        source={require('./Images/calendar.png')}
                      />
                    </TouchableOpacity>
                    <View
                      style={{
                        height: 3,
                        width: widthPercentageToDP(35),
                        backgroundColor: '#3a9f9a',
                        alignSelf: 'center',
                      }}
                    />
                    <TouchableOpacity
                      style={{
                        height: 'auto',
                        width: '100%',
                        alignItems: 'center',
                        paddingTop: 10,
                      }}
                      onPress={() =>
                        this.props.navigation.navigate('ToDo')
                      }>
                      <Image
                        style={{
                          alignSelf: 'center',
                          height: PixelToDP(40),
                          width: PixelToDP(40),
                        }}
                        resizeMode={'contain'}
                        source={require('./Images/todo.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {this.state.Goal.map((goal, index) => (
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    backgroundColor: 'white',
                    width: widthPercentageToDP(17),
                    height: widthPercentageToDP(17),
                    borderRadius: widthPercentageToDP(18),
                    borderWidth: PixelToDP(4),
                    borderColor: '#3a9f9a',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#121010',
                    shadowOffset: {
                      width: 0,
                      height: 6,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 3.84,
                    elevation: 6,
                    transform: [
                      { rotate: this.setAngle(index) + 'deg' },
                      { translateX: (0, widthPercentageToDP(34)) },
                      { rotate: -this.setAngle(index) + 'deg' },
                    ],
                  }}
                  onPress={() => {
                    this.props.navigation.navigate('CreateGoal', {
                      goalId: goal.Id,
                      goalIcon: goal.icon,
                      goalCustomIcon: goal.customImg
                    });
                  }}>
                  {goal.customImg == 1 ?
                    <Image style={styles.customHomeImage}
                      resizeMode={'cover'}
                      source={{ uri: goal.icon }}
                    />
                    :
                    <Image style={styles.nonCustomHomeImage}
                      resizeMode={'contain'}
                      source={{ uri: goal.icon }}

                    />
                  }
                </TouchableOpacity>
              ))}
            </View>
            <CreateGoalDialog
              visible={this.state.CreateGoalDialogVisible}
              onClose={goalTitle => {
                this.setState({ CreateGoalDialogVisible: false });
                console.log('Home.js, GoalTitle:' + goalTitle);
                if (goalTitle != '' && goalTitle != undefined) {
                  let data = {
                    Id: null,
                    goal: goalTitle,
                    refTaskIcon: null,
                    accomplishedPercentage: 0,
                    isCompleted: 0,
                    isActive: 1,
                  };
                  this.props.navigation.navigate('AddIcon', {
                    GoalData: data,
                    isEdited: 'false',
                  });
                }
              }}
            />
            <View
              style={styles.buttonsFooter}>
              <TouchableOpacity
                style={{
                  height: 'auto',
                  alignItems: 'center',
                }}
                onPress={() => this.props.navigation.navigate('JournalListingsScreen')}>
                <Image
                  style={{
                    alignSelf: 'center',
                    height: heightPercentageToDP(9),
                    width: heightPercentageToDP(9),
                  }}
                  resizeMode={'contain'}
                  source={require('./Images/feather.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: 'auto',
                  alignItems: 'center',
                }}
                onPress={() => {
                  if (this.state.Goal.length == 8) {
                    Alert.alert(
                      'Alert',
                      'Max goals reached. Please complete or delete one of your previous goals before starting a new one.',
                      [
                        {
                          text: 'OK',
                          onPress: () => {
                            console.log('OK Pressed')
                          }
                        }])
                  } else {
                    this.setState({
                      CreateGoalDialogVisible: !this.state.CreateGoalDialogVisible,
                    })
                  }
                }
                }
              >
                <Image
                  style={{
                    alignSelf: 'center',
                    height: heightPercentageToDP(10.5),
                    width: heightPercentageToDP(10.5),
                  }}
                  resizeMode={'contain'}
                  source={require('./Images/plus.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: 'auto',
                  alignItems: 'center',
                }}
                onPress={() => this.props.navigation.navigate('Statistics')}>
                <Image
                  style={{
                    alignSelf: 'center',
                    height: heightPercentageToDP(9),
                    width: heightPercentageToDP(9),
                  }}
                  resizeMode={'contain'}
                  source={require('./Images/pie.png')}
                />
              </TouchableOpacity>
            </View>
            <View
              style={styles.buttonsFooterText}>
              <Text style={styles.buttonsFooterTextTitle}>
                Journal
                </Text>
              <Text style={[styles.buttonsFooterTextTitle, {
                top: 5
              }]}>
                New Value
                </Text>
              <Text style={styles.buttonsFooterTextTitle}>
                Stats
                </Text>
            </View>
          </ImageBackground>
        </Root>
      </View>
    );
  }
}

export const tstyles = StyleSheet.create({
  roundImage: {
    borderRadius: PixelToDP(40),
    backgroundColor: 'white',
    width: PixelToDP(40),
    height: PixelToDP(40),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    transform: [{ rotate: '90deg' }, { translateX: (0, -10) }, { rotate: '-90deg' }],
  },
});
