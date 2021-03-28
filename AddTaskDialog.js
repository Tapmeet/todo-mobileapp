import React, {PureComponent} from 'react';
import {View, TouchableOpacity, TextInput, Modal, Keyboard,KeyboardAvoidingView} from 'react-native';
import {Text, Icon, Card, Toast} from 'native-base';
import {styles} from './CustomStyleSheet';
import {
  heightPercentageToDP,
  PixelToDP,
  widthPercentageToDP,
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
    this.setState({task: text});
  };
  handleDescription = text => {
    this.setState({taskDescription: text});
  };
  render() {
    // {console.log("selected TAsk 2 :", this.props.selectedTask);
    // console.log("sate value :",this.state)}
    const {task, taskDescription} = this.state;
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
                     height: heightPercentageToDP(45),
                     // height:'auto',
                     width: widthPercentageToDP(90),
                     alignSelf: 'center',
                     marginTop:PixelToDP(130),
                     // position:'absolute',
                     // // top:heightPercentageToDP(20),
                     // bottom:heightPercentageToDP(20)
                     // marginBottom: heightPercentageToDP(20),
                 }}
                 >
                 <View
                     style={{
                         width: widthPercentageToDP(80),
                         alignSelf: 'center',
                         paddingTop: PixelToDP(20),
                         flexDirection: 'column',
                         alignItem: 'center',
                         height: '100%',
                     }}>
                     {/*{console.log("task : ",this.props.selectedTask.task)}*/}
                     {/*<Text style={styles.addTaskTextInput}>{task}</Text>*/}
                     <TextInput
                         style={styles.addTaskTextInput}
                         value={task}
                         placeholder={'Name: e.g. buy 5 fruits'}
                         onChangeText={this.handleTask}
                         onKeyPress={(e)=> {if(e.nativeEvent.key == "Enter") {
                             Keyboard.dismiss();
                         }}}
                     />
                     <TextInput
                         style={styles.addTaskDescTextInput}
                         value={taskDescription}
                         multiline={true}
                         // numberOfLines={15}
                         placeholder={
                             'Description: e.g. Buy five fruits by the end of the week.(Try to make this S.M.A.R.T. Specific, Measurable, Achievable, Realistic, Time-Bound).'
                         }
                         onKeyPress={(e)=> {if(e.nativeEvent.key == "Enter") {
                             Keyboard.dismiss();
                         }}}
                         onChangeText={this.handleDescription}
                     />
                     <TouchableOpacity
                         style={{
                             backgroundColor: '#30B3AB',
                             height: PixelToDP(60),
                             width: PixelToDP(60),
                             borderRadius: PixelToDP(50),
                             alignItems: 'center',
                             justifyContent: 'center',
                             position: 'absolute',
                             right: PixelToDP(10),
                             bottom: PixelToDP(10),
                             // marginTop:PixelToDP(20)
                         }}
                         onPress={() => {
                             this.props.onClose(this.state.task, this.state.taskDescription);
                         }}>
                         <Icon
                             name="chevron-right"
                             type="Feather"
                             style={{
                                 fontSize: PixelToDP(30),
                                 color: 'white',
                             }}
                         />
                     </TouchableOpacity>
                 </View>
             </Card>
         </KeyboardAvoidingView>
      </Modal>
    );
  }
}
