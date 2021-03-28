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
          style={{
            backgroundColor: 'white',
            borderRadius: PixelToDP(20),
            height: heightPercentageToDP(80),
            width: widthPercentageToDP(85),
            alignSelf: 'center',
            marginTop: heightPercentageToDP(10),


          }}>
          <View
            style={{
              borderWidth: 6,
              borderRadius: PixelToDP(20),
              borderColor: "#3a9f9a",
              width: widthPercentageToDP(85),
              alignSelf: 'center',
              paddingTop: PixelToDP(35),
              flexDirection: 'column',
              alignItem: 'center',
              height: '100%',
              paddingBottom: 50,
            }}>

            <Text
              style={{
                fontSize: responsiveFontSize(2.5),
                fontWeight: 'bold',
                // height: PixelToDP(60),
                width: '80%',
                marginBottom: PixelToDP(20),
                textAlign: 'center',
                textAlignVertical: 'center',
                color: "#3a9f9a",
                alignSelf: "center"
              }}>
              What would you like to accomplish?
            </Text>
            <View style={{
              borderWidth: 6,
              borderTopLeftRadius: PixelToDP(40),
              borderBottomRightRadius: PixelToDP(40),
              borderColor: "#3a9f9a",
              width: widthPercentageToDP(70),
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
              <Text style={{ width: '90%', color: "white", alignSelf: "center", fontSize: responsiveFontSize(2), fontWeight: "bold" }}>Press Here To Enter Your Value!</Text>
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
              <Text style={{ width: '90%', textAlign: "center", color: "white", alignSelf: "center", fontSize: responsiveFontSize(2), fontWeight: "bold" }}>E.g: Being Healthier in Life</Text>


            </View>
            <Button
              transparent
              style={{
                borderWidth: PixelToDP(5),
                alignSelf: 'center',
                borderColor: '#58c3be',
                width: widthPercentageToDP(70),
                height: 'auto',
                margin: PixelToDP(12),
                padding: PixelToDP(10),
                borderRadius: PixelToDP(20),
                backgroundColor: 'white',
                shadowColor: '#121010',
                justifyContent:"center",
                marginTop:30,
                shadowOffset: {
                  width: 0,
                  height: 6,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 6,
              }}
              onPress={() => {
                this.props.onClose(this.state.goalTitle);
              }}>
              <Text
                style={{
                  color: '#4bc9c1',
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
                backgroundColor: '#30B3AB',
                height: PixelToDP(50),
                width: PixelToDP(50),
                borderRadius: PixelToDP(50),
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                right: PixelToDP(10),
                bottom: PixelToDP(10),
              }}
              onPress={() => {
                this.props.onClose(this.state.goalTitle);
              }}>
              <Icon
                name="chevron-right"
                type="Feather"
                style={{
                  fontSize: PixelToDP(30),
                  color: 'white',
                }}
              />
            </TouchableOpacity> */}
          </View>
        </Card>
      </Modal>
    );
  }
}
