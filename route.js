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
			tabBarIcon: getTabBarIcon('reminder')
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
			tabBarIcon: getTabBarIcon('notebook')
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