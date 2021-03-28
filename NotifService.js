// https://github.com/zo0r/react-native-push-notification
import PushNotification from 'react-native-push-notification';
import {Alert,Platform} from'react-native'
import PushNotificationIOS from "@react-native-community/push-notification-ios";

export default class NotifService {
  constructor(onRegister, onNotification) {
    this.configure(onRegister, onNotification);
  }
  configure(onRegister, onNotification, gcm = '') {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: onRegister, //this._onRegister.bind(this),

      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        console.log("NOTIFICATION:", notification);

        // process the notification

        // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      senderID: gcm,
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true,
    });
  }
  scheduleNotif(Id, title, Description, time, repeat) {
    console.log('schedule Notification method is called:' + Id + ", " + time + " , " + Description);
    // Alert.alert("alert",repeat);
    // if (Platform.OS === 'android') {
      console.log("android push notification is executed");
      PushNotification.localNotificationSchedule({
        // date: new Date(Date.now() + (60 * 1000)), // in 30 secs
        date: time,
        /* Android Only Properties */
        // id: Id.toString(), // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
        ticker: Description, // (optional)
        autoCancel: false, // (optional) default: true
        largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
        smallIcon: 'ic_launcher', // (optional) default: "ic_notification" with fallback for "ic_launcher"
        bigText: Description, // (optional) default: "message" prop
        subText: "", // (optional) default: none
        color: 'blue', // (optional) default: system default
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        tag: 'some_tag', // (optional) add tag to message
        group: 'group', // (optional) add group to message
        ongoing: false, // (optional) set whether this is an "ongoing" notification
        priority: "max",
        importance: "high",
        visibility: "public",
        /* iOS only properties */
        alertAction: 'view', // (optional) default: view
        category: "LocalNotification", // (optional) default: null
        userInfo: {id: Id.toString()}, // (optional) default: null (object containing additional notification data)
        foreground: true,
        /* iOS and Android properties */
        title: title, // (optional)
        message: Description, // (required)
        playSound: true, // (optional) default: true
        repeatType: repeat,
        number: '1',
        soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      });
  //   }
  // else
  // {
  //   console.log("ios push notification is executed");
  // PushNotificationIOS.scheduleLocalNotification({
  //     fireDate :time.toISOString(),
  //     alertBody : Description,
  //     alertTitle : title,
  //     alertAction : 'view',
  //     soundName : 'default',
  //     isSilent : false,
  //     repeatInterval: repeat,
  //     // category : "LocalNotification",
  //     userInfo : {id: Id.toString()},
  //     });
  //   }
  //
  //   PushNotificationIOS.getDeliveredNotifications((notification)=>{
  //     console.log("Delivered notification",notification);
  //   });
  }
  checkPermission(cbk) {
    return PushNotification.checkPermissions(cbk);
  }
  getScheduledNotification(){
    PushNotificationIOS.getScheduledLocalNotifications((notification)=> {
      console.log("scheduled notification",notification);
    });
  }
  cancelNotif(Id) {
    console.log("notification canceled:",Id);
    // PushNotification.cancelLocalNotifications({id: ''+this.lastId});
    PushNotification.cancelLocalNotifications({id: Id.toString()});
  }
  cancelAll() {
    console.log("cancel all Notification method is called");
    PushNotification.cancelAllLocalNotifications();
  }
}
