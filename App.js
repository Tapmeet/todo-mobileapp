import React, {Component} from 'react';
import {Home} from './Home';
import {Routs} from './Route';
import SQLdatabase from './SQLdatabase';
import {Root} from 'native-base';
import { insertTaskIcon} from './InsertInToDatabase'
import {AsyncStorage, StatusBar, View} from 'react-native';

const db = new SQLdatabase();
console.disableYellowBox = true;
// react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
export class App extends Component {

    constructor(props, context) {
        super(props, context);
        // const value = await AsyncStorage.getItem('IconInserted');
        // if (!value) {
            db.getTaskIcon().then(result => {
                if (result.row.length <= 0) {
                    insertTaskIcon(() => {
                        console.log("data inserted successfully");
                    });
                }
            })
        // }
    }
    componentDidMount() {

    }
    state = {
        isFinish: false,
    };

    render() {
        return (
        <Routs/>);
    }
}

export default App;
