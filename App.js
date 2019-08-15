import React from 'react';
import { UIManager, Platform, Alert, ActivityIndicator, View, Text } from 'react-native';
import { Notifications } from 'expo';
import * as Font from 'expo-font';

import AppContainer from './route';
import Notifs from './utils/Notifs';

export default class App extends React.Component {

	state = {
		token: null,
		notification: null,
		allFontsLoaded: false,
	};

	async componentDidMount(){
		Notifs.registerForPushNotificationsAsync();
    Notifications.addListener(this._handleNotification);

    await Font.loadAsync({
      'AvenirNext-Bold': require('./assets/fonts/AvenirNext-Bold.ttf'),
      'AvenirNext-DemiBold': require('./assets/fonts/AvenirNext-DemiBold.ttf'),
      'AvenirNext-Heavy': require('./assets/fonts/AvenirNext-Heavy.ttf'),
      'AvenirNext-Medium': require('./assets/fonts/AvenirNext-Medium.ttf'),
      'AvenirNext-Regular': require('./assets/fonts/AvenirNext-Regular.ttf'),
      'AvenirNext-UltraLight': require('./assets/fonts/AvenirNext-UltraLight.ttf'),
    });

    this.setState({allFontsLoaded: true});
	}

	_handleNotification = notification => {
		if (notification.origin === 'received') {
      Alert.alert('Reminder', "Check your reminder, there's something you have to do!");
    }
  }

	render() {
		const {notification, allFontsLoaded} = this.state;

		if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental){ 
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}

		if (notification) console.log(JSON.stringify(this.state.notification.data.message));

		if (allFontsLoaded) {
			return (
		    <AppContainer/>
		  );
		} else {
			return (
				<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
					<ActivityIndicator size='large' color='#568EA6' size='large'/>
					<Text style={{color: 'grey', marginTop: 10}}>Loading resources</Text>
				</View>
			);
		}
	}
}
