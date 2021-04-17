import React, { PureComponent } from 'react';
import { View, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Text, Icon, Card, Button } from 'native-base';
import { styles } from './CustomStyleSheet';
import {
  heightPercentageToDP,
  PixelToDP, responsiveFontSize,
  widthPercentageToDP,
} from './PixelRatio';

export class CreateGoalDialog extends PureComponent {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      goalTitle: '',
    };
    props = {
      visible: false,
      goal: [],
      // eslint-disable-next-line no-undef
      onClose: goalTitle => Void,
    };
  }
  setGoal = () => {
    this.setState({
      goalTitle: this.props.goal,
    });
  };
  handleGoal = text => {
    this.setState({ goalTitle: text });
  };
  render() {
    const { goalTitle } = this.state;
    return (
      <Modal
        presentationStyle="overFullScreen"
        animationType="slide"
        onShow={this.setGoal}
        visible={this.props.visible}
        onRequestClose={() => this.props.onClose(undefined)}
        transparent={true}>
        <Card
          style={styles.modalBg}>
          <View
            style={styles.modalOuter}>
            <Text
              style={styles.modalTitle}>
              What do you value in life?
            </Text>
            <View style={styles.modalTextArea}>
              <Text style={styles.modalText}>Press Here To Enter Your Value!</Text>
              <TextInput
                style={[styles.addTaskDescTextInputGoal]}
                value={goalTitle}
                editable={true}
                ref='taskDescription'
                multiline={true}
                returnKeyType={"done"}
                numberOfLines={15}
                placeholderTextColor="#ffffff"
                clearTextOnFocus={true}
                onChangeText={this.handleGoal}
              />
              <Text style={styles.modalText}>E.g: Being Healthier in Life</Text>
            </View>
            <Button
              transparent
              style={[styles.homeButton, {
                borderWidth: PixelToDP(5),
                width: widthPercentageToDP(70),
                margin: PixelToDP(12),
                padding: PixelToDP(10),
                borderRadius: PixelToDP(20),
                justifyContent: "center",
                marginTop: 30,
              }]}
              onPress={() => {
                this.props.onClose(this.state.goalTitle);
              }}>
              <Text
                style={{
                  color: '#4bc9c1',
                  fontSize: responsiveFontSize(2.5),
                  textTransform: 'capitalize',
                  fontFamily: 'Oswald-Regular',
                  letterSpacing: 0.7,
                  alignSelf: "center",
                  textAlign: "center",
                  width: widthPercentageToDP(100)
                }}>
                Next
              </Text>
            </Button>
          </View>
        </Card>
      </Modal>
    );
  }
}
