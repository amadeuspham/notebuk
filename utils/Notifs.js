import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

export default {
  async registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      //console.log('not');
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      //console.log('not again');
      return;
    }

    console.log('Notification permissions granted.')
  },

  sendDelayedNotification (title, body, dateObj) {
    const localNotification = {
      title: title,
      body: body,
      data: { type: 'delayed' },
      android: {
        sound: true,
      },
      ios: {
        sound: true,
      },
    };

    const schedulingOptions = {
      time: dateObj.getTime(),
    }

    //console.log('Scheduling delayed notification:', { localNotification, schedulingOptions })

    Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions)
      .then(id => {return id})
      .catch(err => console.error(err))
  }
}
