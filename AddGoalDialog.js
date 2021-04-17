import React, { PureComponent } from "react";
import {
    View,
    TouchableOpacity,
    TextInput,
    Modal
} from "react-native";
import { Text, Icon, Card } from 'native-base';
import { styles } from "./CustomStyleSheet";
import { heightPercentageToDP, PixelToDP, widthPercentageToDP } from "./PixelRatio";

export class AddGoalDialog extends PureComponent {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
        }
        props = {
            visible: false,
            onClose: () => Void
        };
    }

    // componentDidMount() {
    //   this.setState({
    //       repeatDay: this.props.navigation.getParam("RepeatDay")? this.props.navigation.getParam("RepeatDay"):'Never'
    //   })
    //
    // }
    render() {
        return (
            <Modal
                presentationStyle="overFullScreen"
                animationType="slide"
                visible={this.props.visible}
                onRequestClose={() => this.props.onClose()}
                transparent={true}
            >
                <Card style={{
                    backgroundColor: 'white',
                    borderRadius: PixelToDP(20),
                    height: heightPercentageToDP(50),
                    width: widthPercentageToDP(95),
                    alignSelf: 'center',
                    marginTop: heightPercentageToDP(20),

                }}>
                    <View style={{
                        width: widthPercentageToDP(80),
                        alignSelf: 'center',
                        paddingTop: PixelToDP(20),
                        flexDirection: 'column',
                        alignItem: 'center',
                        height: '100%'
                    }}>
                        <TextInput style={styles.addTaskTextInput} placeholder={'e.g. buy 5 fruits'} />
                        <TextInput style={styles.addTaskDescTextInput}
                            multiline={true} numberOfLines={15}
                            placeholder={'Description: e.g. Buy five fruits by the end of the week.(Try to make this S.M.A.R.T. Specific, Measurable, Achievable, Realistic, Time-Bound).'}
                        />
                        <TouchableOpacity style={{
                            backgroundColor: '#30B3AB',
                            height: PixelToDP(50),
                            width: PixelToDP(50),
                            borderRadius: PixelToDP(50),
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            right: PixelToDP(10),
                            bottom: PixelToDP(10)
                        }}
                            onPress={() => { this.props.onClose(); }}>
                            <Icon
                                name="chevron-right"
                                type="Feather"
                                style={{
                                    fontSize: PixelToDP(30),
                                    color: "white",
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                </Card>
            </Modal>
        );
    }
}
