import React from 'react';
import { UIManager, Platform, Alert } from 'react-native';
import { Notifications } from 'expo';

import AppContainer from './route';
import Notifs from './utils/Notifs';

export default class App extends React.Component {

	state = {
		token: null,
		notification: null,
	};

	componentDidMount(){
		Notifs.registerForPushNotificationsAsync();

    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    Notifications.addListener(this._handleNotification);
	}

	_handleNotification = notification => {
		if (notification.origin === 'received') {
      Alert.alert('Reminder', "Check your reminder, there's something you have to do!");
    }
  }

	render() {
		const {notification} = this.state;

		if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental){ 
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}

		if (notification) console.log(JSON.stringify(this.state.notification.data.message));

	  return (
	    <AppContainer/>
	  );
	}
}
