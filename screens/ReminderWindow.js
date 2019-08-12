import React from 'react';
import {View, StyleSheet, TouchableOpacity, StatusBar, Text} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import store from '../store';
import RemindersList from '../components/RemindersList';
import {fetchData, storeData, saveData} from '../utils/DataManager';

export default class ReminderWindow extends React.Component {
	static navigationOptions = ({navigation, navigation: { navigate } }) => ({
		title: 'Reminders',
		headerLeft: (
			<TouchableOpacity onPress={navigation.toggleDrawer}>
				<AntDesign 
					name='tag' 
					size={25} 
					style={{ color: 'black', marginLeft: 15 }}
				/>
			</TouchableOpacity>
		),
		headerRight: (
			<TouchableOpacity onPress={navigation.getParam('newReminder')}>
				<AntDesign 
					name='plus' 
					size={25} 
					style={{ color: 'black', marginRight: 15 }}
				/>
			</TouchableOpacity>
		),
	});

	state = {
		allReminders: store.getState().reminders,
		tagName: null,
		filteredReminders: null,
		filtering: false,
	};

	async componentDidMount(){
		const {navigation} = this.props;

		this.unsubscribe = store.onChange(() => {
			this.setState({
				allReminders: store.getState().reminders, 
			});
		});

		navigation.setParams({ 'newReminder': this.newReminder });
		navigation.setParams({ 'tagName': null });
	}

	async componentDidUpdate(prevProps, prevState){
		const {navigation, navigation: {state: {params}}} = this.props;
		const {allReminders} = this.state;
		const tagName = params.tagName == 'All notes' ? null : params.tagName;

		if (tagName !== this.state.tagName) {
	    this.setState({tagName});
	  }

	  if (this.state.tagName !== prevState.tagName) {
		  if (tagName) {
		  	//console.log('not all');
				const filteredReminders = allReminders.filter(reminder => reminder.tagName === tagName);
				this.setState({filteredReminders, filtering: true});
		  } else {
		  	this.setState({filteredReminders: null, filtering: false});
		  }
		}

		if (this.state.allReminders !== prevState.allReminders && this.state.allReminders){
			await saveData('allReminders', this.state.allReminders);
		}
	}

	componeneWillUnmount() {
		this.unsubscribe();
	}

	updateReminders = async() => {
		const allRemindersUpdated = await fetchData('allReminders');
		//console.log('new');
		//console.log(allRemindersUpdated);
		store.setState({reminders: allRemindersUpdated});
	}

	toggleReminder = async (id, content, time, done, settingDueDate, dueDate, tagName, notiID) => {
		done = !done;
		const dueDateString = dueDate ? dueDate.toISOString() : null;
		const reminderData = {id, content, time, done, settingDueDate, dueDateString, tagName, notiID};
		await storeData(id, reminderData, 'allReminders'); 
		await this.updateReminders();
	}

	newReminder = () => {
		const { navigation: { navigate } } = this.props;
		navigate('ReminderDetails', {
			reminder: null,
			updateReminders: this.updateReminders,
		});
	}

	openReminder = (reminder, dueDate) => {
		const { navigation: { navigate } } = this.props;
		navigate('ReminderDetails', {
			reminder,
			dueDate,
			updateReminders: this.updateReminders,
			toggleReminder: this.toggleReminder,
		});
	}

	render(){
		const {allReminders, filtering, filteredReminders} = this.state;

		return(
			<View style={styles.container}>
				<StatusBar barStyle="dark-content" backgroundColor='dodgerblue' translucent={false}/>
				<View style={styles.remindersList}>
					{allReminders.length === 0 &&
						<Text style={styles.noNoteText}>You don't have any reminder. Set some!</Text>
					}
					<RemindersList
						reminders={filtering ? filteredReminders : allReminders}
						openReminder={this.openReminder}
						updateReminders={this.updateReminders}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	noNoteText: {
		color: 'grey',
		marginTop: 10,
	},
	remindersList: {
		flex: 1,
	},
});