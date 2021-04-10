import React, { PureComponent } from 'react';
import { View, TouchableOpacity, TextInput, Modal, Keyboard, KeyboardAvoidingView } from 'react-native';
import { Text, Icon, Card, Toast } from 'native-base';
import { styles } from './CustomStyleSheet';
import {
  heightPercentageToDP,
  PixelToDP,
  widthPercentageToDP,
  responsiveFontSize
} from './PixelRatio';

export class AddTaskDialog extends PureComponent {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    props = {
      visible: false,
      addTo: [],
      selectedTask: [],
      // eslint-disable-next-line no-undef
      onClose: (t, tD) => Void,
    };
    this.state = {
      task: '',
      taskDescription: '',
    };
    this.updateState = this.updateState.bind(this);
  }
  updateState = () => {
    if (this.props.selectedTask != null) {
      console.log(
        'updateState method is executed : task =' +
        this.props.selectedTask.task +
        ', taskDescription :' +
        this.props.selectedTask.taskDescription,
      );
      this.setState({
        task: this.props.selectedTask.task,
        taskDescription: this.props.selectedTask.taskDescription,
      });
    }
    else {
      this.setState({
        task: '',
        taskDescription: '',
      });
    }
  };
  handleTask = text => {
    this.setState({ task: text });
  };
  handleDescription = text => {
    this.setState({ taskDescription: text });
  };
  render() {
    // {console.log("selected TAsk 2 :", this.props.selectedTask);
    // console.log("sate value :",this.state)}
    const { task, taskDescription } = this.state;
    //const [value, onChangeText] = React.useState(this.state.task);
    return (
      <Modal
        presentationStyle="overFullScreen"
        animationType="slide"
        onShow={this.updateState}
        visible={this.props.visible}
        onRequestClose={() =>
          this.props.onClose(undefined, undefined)
        }
        transparent={true}>
        <KeyboardAvoidingView
          tyle={styles.container} behavior="position" enabled>
          <Card
            style={{
              backgroundColor: 'white',
              borderRadius: PixelToDP(20),
              height: heightPercentageToDP(70),
              // height:'auto',
              width: widthPercentageToDP(90),
              alignSelf: 'center',
              marginTop: PixelToDP(40),
              // position:'absolute',
              // // top:heightPercentageToDP(20),
              // bottom:heightPercentageToDP(20)
              // marginBottom: heightPercentageToDP(20),
            }}
          >
            <View
              style={{
                borderWidth: 6,
                borderRadius: PixelToDP(20),
                borderColor: "#3a9f9a",
                width: widthPercentageToDP(90),
                alignSelf: 'center',
                paddingTop: PixelToDP(35),
                flexDirection: 'column',
                alignItem: 'center',
                height: '100%',
                paddingBottom: 50,
                shadowColor: '#121010',
                shadowOffset: {
                  width: 0,
                  height: 10,
                },
                shadowOpacity: 0.8,
                shadowRadius: 3.84,
                elevation: 10,
                backgroundColor: "#fff"
              }}>
              {/*{console.log("task : ",this.props.selectedTask.task)}*/}
              {/*<Text style={styles.addTaskTextInput}>{task}</Text>*/}
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
                    elevation: 10,
                    paddingTop: 10,
                    paddingBottom: 10
                  },
                ]}
                value={task}
                placeholder={'Name: e.g. buy 5 fruits'}
                onChangeText={this.handleTask}
                onKeyPress={(e) => {
                  if (e.nativeEvent.key == "Enter") {
                    Keyboard.dismiss();
                  }
                }}
              />
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
                <TextInput
                  style={[
                    styles.addTaskDescTextInputGoalTask,
                    { color: 'white', fontSize: responsiveFontSize(2), lineHeight: 30 },
                  ]}
                  value={taskDescription}
                  multiline={true}
                  // numberOfLines={15}
                  placeholderTextColor="#ffffff"
                  placeholder={
                    'Description: e.g. Buy five fruits by the end of the week.(Try to make this S.M.A.R.T. Specific, Measurable, Achievable, Realistic, Time-Bound).'
                  }
                  onKeyPress={(e) => {
                    if (e.nativeEvent.key == "Enter") {
                      Keyboard.dismiss();
                    }
                  }}
                  onChangeText={this.handleDescription}
                />
              </View>
              <TouchableOpacity
                style={{
                  width: widthPercentageToDP(75),
                  marginTop:40,
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
                onPress={() => {
                  this.props.onClose(this.state.task, this.state.taskDescription);
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
                  Submit
              </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
}
