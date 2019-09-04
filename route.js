import React from 'react';
import { createAppContainer, createStackNavigator, createDrawerNavigator, createBottomTabNavigator } from 'react-navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Book from './screens/Book';
import ReminderWindow from './screens/ReminderWindow';
import ReminderDetails from './screens/ReminderDetails';
import Page from './screens/Page';
import TagList from './components/TagList';
import store from './store';

const getTabBarIcon = icon => ({tintColor}) => (
	<MaterialCommunityIcons name={icon} size={26} style={{color: tintColor}}/>
);

// stacknavigator generates a higher-order component providing each of the screens
// with a navigation prop


const RemindersStack = createStackNavigator(
	{
		ReminderWindow: {
			screen: ReminderWindow,
		},
		ReminderDetails: {
			screen: ReminderDetails,
		},
	},
	{
		mode: 'modal',
		initialRouteName: 'ReminderWindow',
		navigationOptions: { 
			tabBarIcon: getTabBarIcon('reminder'),
		},
		defaultNavigationOptions: {
			headerStyle: {
				backgroundColor: '#F1D1B5',
			},
			headerTitleStyle: {
	      fontFamily: 'AvenirNext-Regular',
	      fontWeight: "400",
	      textAlign: 'center',
        flexGrow:1,
        alignSelf:'center',
	    },
			headerTintColor: '#363636',
		},
	},
);

const BookStack = createStackNavigator(
	{
		Book: {
			screen: Book,
		},
		Page: {
			screen: Page,
		},
	},
	{
		initialRouteName: 'Book',
		navigationOptions: { 
			tabBarIcon: getTabBarIcon('notebook'),
		},
		defaultNavigationOptions: {
			headerStyle: {
				backgroundColor: '#F1D1B5',
				//height: 40,
			},
			headerTitleStyle: {
	      fontFamily: 'AvenirNext-Regular',
	      fontWeight: "400",
	      textAlign: 'center',
        flexGrow:1,
        alignSelf:'center',
	    },
			headerTintColor: '#363636',
		},
	},
);

const TabNavigator = createBottomTabNavigator(
  {
		Notebuk: {
			screen: BookStack,
		},
		Reminders: {
			screen: RemindersStack,
		},
	},
	{
		initialRouteName: 'Notebuk',
		defaultNavigationOptions: ({ navigation }) => ({
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        //console.log('onPress:', navigation.state.routeName);
        store.setState({currentRoute: navigation.state.routeName});
        defaultHandler();
      },
    }),
    tabBarOptions: {
    	activeTintColor: '#363636',
    	inactiveTintColor: '#8c8c8c',
    	inactiveBackgroundColor: '#F1D1B5',
    	style: {
    		backgroundColor: '#F1D1B5',
    	},
    	labelStyle: {
    		fontFamily: 'AvenirNext-DemiBold',
    	},
    	keyboardHidesTabBar: true,
    },
	},
);

const TagDrawer = createDrawerNavigator(
  {
    Tab: {
      screen: TabNavigator,
    },
  },
  {
  	initialRouteName: 'Tab',
    contentComponent: TagList
  }
);

const AppContainer = createAppContainer(TagDrawer);

export default AppContainer;