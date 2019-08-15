import React from 'react';
import {View, StyleSheet, TouchableOpacity, StatusBar, Text} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import store from '../store';
import RemindersList from '../components/RemindersList';
import {fetchData, storeData, saveData} from '../utils/DataManager';

export default class ReminderWindow extends React.Component {
	static navigationOptions = ({navigation, navigation: {state: {params}}}) => {
		const currentTag = params ? params.tagName : 'All reminders';

		return ({
			title: 'Reminders',
			headerLeft: (
				<TouchableOpacity onPress={navigation.toggleDrawer}>
					<View style={styles.tagSection}>
						<AntDesign 
							name='tag' 
							size={25} 
							style={{ color: '#363636', marginLeft: 15, marginRight: 10 }}
						/>
						<Text style={styles.tagText}>{currentTag}</Text>
					</View>
				</TouchableOpacity>
			),
			headerRight: (
				<TouchableOpacity onPress={navigation.getParam('newReminder')}>
					<AntDesign 
						name='plus' 
						size={25} 
						style={{ color: '#363636', marginRight: 15 }}
					/>
				</TouchableOpacity>
			),
		});
	};

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
		const tagName = params.tagName == 'All' ? null : params.tagName;

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
		const {allReminders, filtering, filteredReminders, filterDueModalOpen} = this.state;

		return(
			<View style={styles.container}>
				<StatusBar barStyle="dark-content"/>
				<View style={styles.remindersList}>
					{allReminders.length === 0 &&
						<Text style={styles.noReminderText}>You don't have any reminder. Set some!</Text>
					}
					{allReminders.length !== 0 && 
						<View>
							<RemindersList
								reminders={filtering ? filteredReminders : allReminders}
								openReminder={this.openReminder}
								updateReminders={this.updateReminders}
							/>
						</View>
					}
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
		backgroundColor: '#EFEEEE',
	},
	tagSection: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	tagText: {
		color: '#363636',
		fontSize: 16,
		fontFamily: 'AvenirNext-Regular',
	},
	noReminderText: {
		fontFamily: 'AvenirNext-Regular',
		color: 'grey',
		fontSize: 16,
	},
	remindersList: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	filterBoxBackground: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)', 
		justifyContent: 'center', 
		alignItems: 'center',
	},
});