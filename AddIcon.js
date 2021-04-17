import React, { PureComponent } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  FlatList,
  ImageStore,
  ImageBackground,
  ActivityIndicator,
  ScrollView, AsyncStorage,
} from 'react-native';
import { Text, Button, Icon, Toast, Root, Spinner } from 'native-base';
import { styles } from './CustomStyleSheet';
import {
  heightPercentageToDP,
  PixelToDP,
  widthPercentageToDP,
  responsiveFontSize
} from './PixelRatio';
import ImagePicker from 'react-native-image-picker';
import { pills } from './Images/pills.png';
import { AddTaskDialog } from './AddTaskDialog';
import SQLdatabase from './SQLdatabase';
import { insertTaskIcon } from './InsertInToDatabase';

const db = new SQLdatabase();
var len = 0;

export class AddIcon extends PureComponent {
  static navigationOptions = {
    header: null,
  };

  constructor(props, context) {
    super(props, context);
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
    this.state = {
      avatarSource: null,
      isLoading: true,
      isTaskStartDateSelected: false,
      taskIcon: [],
      IconId: 0,
      goal: '',
      icon: '',
      customIcon: ''
    };

  }
  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      // this.insertTaskIcon();
      this.getTaskIconList();
    });
  }
  updateGoal() {
    let data = this.props.navigation.getParam('GoalData');
    data.refTaskIcon = this.state.IconId;
    console.log('AddIcon.js, Goal and icon', data);
    db.updateGoals(data.Id, data).then(result => {
      this.props.navigation.navigate('CreateGoal', {
        goalId: data.Id,
        goalIcon: this.state.icon,
        goalCustomIcon: this.state.customIcon
      });
    });
  }
  saveGoal() {
    console.log('saveGoal method is executed');
    if (this.props.navigation.getParam('isEdited') == 'true') {
      this.updateGoal();
    } else {
      if (this.state.IconId) {
        let goals = [];
        let exist = 0;
        let len;
        db.getGoals()
          .then(data => {
            len = data.length;
            goals = data.find(
              d => d.refTaskIcon == this.state.IconId && d.isActive == 1,
            );
            if (goals != null) {
              console.log(
                'Icon is already selected, Please select other icon.',
              );
              Toast.show({
                text: 'Icon is already selected, Please select other icon.',
                buttonText: 'Hide',
              });
            } else {
              len++;
              let data = this.props.navigation.getParam('GoalData');
              data.Id = len;
              data.refTaskIcon = this.state.IconId;
              console.log('AddIcon.js, goal data', data);
              db.insertInToGoals(data)
                .then(result => {
                  console.log(result);
                  this.props.navigation.navigate('CreateGoal', {
                    goalId: result.insertId,
                    goalIcon: this.state.icon,
                    goalCustomIcon: this.state.customIcon
                  });
                })
                .catch(err => {
                  console.log(err);
                });
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        console.log('Please Select icon from the list');
        Toast.show({
          text: 'Please Select icon from the list',
          buttonText: 'Hide',
        });
      }
    }
  }
  // setIconInserted = async()=>{
  //     try {
  //         await AsyncStorage.setItem("IconInserted", true);
  //     } catch (e) {
  //         alert(e);
  //         // saving error
  //     }
  // }
  getTaskIconList = async () => {
    console.log('getTaskIconList is executed');
    let taskIcon = [];
    const value = await AsyncStorage.getItem('IconInserted');
    console.log("value :", value);
    if (value) {
      console.log("value is true!");
      db.getTaskIcon().then((result) => {
        taskIcon = result;
        taskIcon.sort((a, b) => b.customImage - a.customImage);
        len = taskIcon.length;
        this.setState({
          taskIcon,
          isLoading: false,
        }, () => {
          console.log('add Icon:' + this.state.taskIcon);
          this.forceUpdate();
        });
      })
    }
    else {
      // db.getTaskIcon()
      //     .then(data => {
      //         taskIcon = data;
      //         len = taskIcon.length;
      //         if(len <= 0)
      //         {
      console.log("value is not true!");
      insertTaskIcon(() => {
        db.getTaskIcon().then(async (result) => {
          taskIcon = result;
          taskIcon.sort((a, b) => a.customImage - b.customImage);
          len = taskIcon.length;
          try {
            await AsyncStorage.setItem("IconInserted", "true");
          } catch (e) {
            alert(e);
          }
          this.setState({
            taskIcon,
            isLoading: false,
          }, () => {
            console.log('add Icon:' + this.state.taskIcon);
            this.forceUpdate();
          });
        })
      })
      // }
      // else
      // {
      //     this.setState({
      //         taskIcon,
      //         isLoading: false,
      //     },()=>{
      //         console.log('add Icon:' + this.state.taskIcon);
      //         this.forceUpdate();
      //     });
      // }

      // })
      // .catch(err => {
      //     console.log(err);
      //     this.setState = {
      //         isLoading: true,
      //     };
      // });
    }
  };

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);
      let dataList = [];

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // let source = {uri: response.uri};

        // You can also display the image using data:
        let source = { uri: 'data:image/jpeg;base64,' + response.data };
        console.log("length of taskIcon :", len);
        dataList.push({
          customImage: 1,
          Id: len + 1,
          icon: source.uri,
        });
        db.insertInToTaskIcon(dataList)
          .then(result => {
            console.log(result);
            this.getTaskIconList();
          })
          .catch(err => {
            console.log(err);
          });

        this.setState({
          avatarSource: source,
        });
      }
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
          resizeMode={'stretch'}>
          <SafeAreaView style={styles.titlebar}> 
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Home')}
              style={[styles.backTouch]}>
              <Image
                style={styles.backImageIcon}
                resizeMode={'stretch'}
                source={require('./Images/back.png')}
              />
              <Text style={styles.backLogo}>CC</Text>
            </TouchableOpacity>
            <View
              style={{
                alignItems: 'center',
                width: widthPercentageToDP(40),
                // marginTop: PixelToDP(20),
              }}>
              {/* <Image
                style={{
                  height: PixelToDP(30),
                  width: PixelToDP(30),
                }}
                resizeMode={'contain'}
                source={require('./Images/logo.png')}
              /> */}
              <Text style={{
                fontSize: responsiveFontSize(2.5),
                color: "white",
                fontWeight: "bold",
              }}>Pick an Icon</Text>
            </View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Settings')}
              style={{
                alignItems: "flex-end",
                justifyContent: "flex-end",
                width: widthPercentageToDP(25),
                paddingLeft: 30
              }}>
              <Image
                style={{
                  justifyContent: "flex-end",
                  height: responsiveFontSize(3.5),
                  width: responsiveFontSize(3.5),
                }}
                resizeMode={'contain'}
                source={require('./Images/settings.png')}
              />
            </TouchableOpacity>
          </SafeAreaView>
          <View
            style={styles.IconBox}>
            <View
              style={{
                width: widthPercentageToDP(90),
                alignSelf: 'center',
                height: PixelToDP(10),
                alignItems: 'center',
                marginTop: PixelToDP(10),
              }}>
              <Text style={styles.settingText2}>
                Select one that best represents your value!
            </Text>
            </View>
            <View
              style={{
                height: heightPercentageToDP(30),
                width: widthPercentageToDP(90),
                alignSelf: 'center',
                justifyContent: 'center',
                marginTop: 50,
                marginBottom: 0
                // backgroundColor:'red'
              }}>
              {this.state.isLoading ? (
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}>
                  <ActivityIndicator size="large" color="black" />
                </View>
              ) : (
                <ScrollView
                  style={{
                    alignSelf: 'center',
                    width: widthPercentageToDP(90),
                    marginBottom: PixelToDP(0),

                  }}>
                  <View style={{
                    alignItems: 'center',
                  }}>
                    <FlatList
                      numColumns={4}
                      data={this.state.taskIcon}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={
                            this.state.IconId == item.Id
                              ? styles.AddIconActive
                              : styles.AddIcon
                          }
                          onPress={() => this.setState({
                            IconId: item.Id,
                            icon: item.icon,
                            customIcon: item.customImage
                          })}>
                          {/*{*/}
                          {/*    console.log('image string is:' + this.setImageString(item.icon))*/}
                          {/*}*/}
                          {item.customImage ? (
                            <Image
                              resizeMode={'cover'}
                              style={{
                                height: '100%',
                                width: '100%',
                                borderRadius: PixelToDP(100),
                              }}
                              source={{ uri: item.icon }}
                            />
                          ) : (
                            <Image
                              resizeMode={'contain'}
                              style={[
                                this.state.IconId == item.Id
                                  ? styles.taskImageWhite
                                  : styles.taskImageGreen,
                                {
                                  height: PixelToDP(25),
                                  width: PixelToDP(25),
                                },
                              ]}
                              source={{ uri: item.icon }}
                            />
                          )}
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={{
              width: widthPercentageToDP(80),
              borderWidth: PixelToDP(5),
              alignSelf: 'center',
              borderColor: '#58c3be',
              height: 'auto',
              paddingTop: 10,
              paddingBottom:10,
              borderRadius: PixelToDP(20),
              backgroundColor: 'white',
              shadowColor: '#121010',
              justifyContent: "center",
              display: "flex",
              marginTop: 30,
              marginBottom:0,
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 6,
            }}
            onPress={this.selectPhotoTapped.bind(this)}>
            <Text style={{
              fontSize: responsiveFontSize(2.5),
              fontWeight: 'bold',
              // height: PixelToDP(60),
              width: '100%',
              textAlign: 'center',
              textAlignVertical: 'center',
              color: "#3a9f9a",
              alignSelf: "center",
              paddingRight:30,
            }}>ADD AN IMAGE
          
            </Text>
            <Icon
                name="camera"
                type="Feather"
                style={{
                  fontSize: PixelToDP(30),
                  color: '#3a9f9a',
                  alignSelf: 'center',
                  marginLeft: PixelToDP(30),
                  position: 'absolute',
                  right:15
                }}
              />
          </TouchableOpacity>
          <Image
            resizeMode={'contain'}
            style={{
              height: PixelToDP(55),
              width: PixelToDP(55),
            }}
            source={this.state.avatarSource}
          />
          <Root>
          <Button
              transparent
              style={{
                borderWidth: PixelToDP(5),
                alignSelf: 'center',
                borderColor: '#58c3be',
                width: widthPercentageToDP(80),
                height: 'auto',
                padding: PixelToDP(10),
                borderRadius: PixelToDP(20),
                backgroundColor: 'white',
                shadowColor: '#121010',
                justifyContent:"center",
                marginTop:0,
                shadowOffset: {
                  width: 0,
                  height: 6,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 6,
              }}
              onPress={this.saveGoal.bind(this)}
              >
              <Text
                style={{
                  color: '#358e89',
                  // fontSize: PixelToDP(14),
                  fontSize: responsiveFontSize(2.5),
                  textTransform: 'capitalize',
                  fontFamily: 'Oswald-Regular',
                  letterSpacing: 0.7,
                  alignSelf:"center",
                  textAlign:"center",
                  width:widthPercentageToDP(100)
                  // fontFamily: "Oswald-Regular"
                }}>
                Next
              </Text>
            </Button>
            {/* <TouchableOpacity
              style={{
                backgroundColor: 'white',
                height: PixelToDP(55),
                width: PixelToDP(55),
                borderRadius: PixelToDP(55),
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                right: PixelToDP(10),
                bottom: PixelToDP(10),
              }}
              onPress={this.saveGoal.bind(this)}>
              <Icon
                name="chevron-right"
                type="Feather"
                style={{
                  fontSize: PixelToDP(30),
                  color: '#325859',
                }}
              />
            </TouchableOpacity> */}
          </Root>
        </ImageBackground>
      </View>
    );
  }
}
