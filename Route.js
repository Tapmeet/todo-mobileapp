import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Home } from './Home';
import { Settings } from './Settings';
import { AddReminder } from './AddReminder';
import { calender } from './calender';
import { Statistics } from './Statistics';
import { ToDo } from './ToDo';
import { AddToCalendar } from './AddToCalendar';
import { Repeat } from './Repeat';
import { AddTaskDialog } from './AddTaskDialog';
import { AccomplishedTasks } from './AccomplishedTasks';
import { AddIcon } from './AddIcon';
import { CreateGoal } from './CreateGoal';
import { StatusDialog } from './StatusDialog';
import { CreateTaskDialog } from './CreateTaskDialog';
import { RepeatEnd } from './RepeatEnd';
import { AboutOne } from './AboutOne';
import { AboutTwo } from './AboutTwo';
import { AboutThree } from './AboutThree';
import { AboutFour } from './AboutFour';
import { SplashScreen } from './SplashScreen';
import { EnterCode } from './EnterCode';
import { AsyncStorage } from 'react-native';
import { JournalScreen } from './JournalScreen';
import { JournalListingsScreen } from './JournalListingsScreen';
import { EditJournalScreen } from './EditJournalScreen';
let isLogin;
const AppNavigator = createStackNavigator(
  {
    Home,
    Settings,
    AddReminder,
    calender,
    Statistics,
    ToDo,
    AddToCalendar,
    Repeat,
    AddTaskDialog,
    AccomplishedTasks,
    AddIcon,
    CreateGoal,
    StatusDialog,
    CreateTaskDialog,
    RepeatEnd,
    AboutOne,
    AboutTwo,
    AboutThree,
    SplashScreen,
    AboutFour,
    EnterCode,
    JournalScreen,
    JournalListingsScreen,
    EditJournalScreen
  },
  {
    initialRouteName: 'SplashScreen',
  },
);

export const Routs = createAppContainer(AppNavigator);
