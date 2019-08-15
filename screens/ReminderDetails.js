import React from 'react';
import {
	View, 
	StyleSheet, 
	TextInput, 
	Dimensions, 
	Text, 
	KeyboardAvoidingView, 
	TouchableOpacity, 
	Switch,
	LayoutAnimation,
	Platform
} from 'react-native';
import uuidv4 from 'uuid/v4';
import { Ionicons } from '@expo/vector-icons';
import { Notifications } from 'expo';

import {storeData} from '../utils/DataManager';
import DueDatePickerIOS from '../components/DueDatePickerIOS';
import DueDatePickerAndroid from '../components/DueDatePickerAndroid';
import TagButton from '../components/TagButton';
import store from '../store';
import Notifs from '../utils/Notifs';

export default class ReminderDetails extends React.Component {
	static navigationOptions = ({navigation, navigation: {state: {params}}}) => {
		const {reminder} = params;

		return {
			title: reminder ? 'Edit reminder' : 'New reminder',
			 headerLeft: (
	      <TouchableOpacity 
	      	onPress={() => {
	      		const saveReminder = navigation.getParam('saveReminder');
	      		saveReminder();
	      		navigation.goBack();
	      	}}
	      >
	      	<Ionicons 
						name='ios-arrow-back' 
						size={30} 
						style={{ marginLeft: 20, color: '#363636' }}
					/>
	      </TouchableOpacity>
	    ),
		};
	}

	constructor(props){
		super(props);

		const now = new Date();
		const dateString = now.toISOString();

		this.state = {
			id: uuidv4(),
			content: null,
			allTags: store.getState().allTags,
			tagName: null,
			time: dateString,
			done: false,
			typingTỉmeout: 0,
			settingDueDate: false,
			dueDate: null,
			notiID: null,
		};
	}

	async componentDidMount(){
		const {navigation, navigation: {state: {params}}} = this.props;
		const {reminder, dueDate} = params;

		navigation.setParams({ 'saveReminder': this.saveReminder });

		this.unsubscribe = store.onChange(() => 
			{
				this.setState({allTags: store.getState().allTags})
			}
		);

		if (reminder === null) return;
		const {id, content, time, done, settingDueDate, dueDateString, tagName, notiID} = reminder;

		this.setState({
			id,
			content,
			time,
			done,
			settingDueDate,
			dueDate,
			tagName,
			notiID,
		});
	};

	componentWillUnmount(){
		this.unsubscribe();
	}

	componentDidUpdate(){
		const animation = LayoutAnimation.create(
			200,
			LayoutAnimation.Types.easeInEaseOut,
			LayoutAnimation.Properties.scaleY,
		);

		LayoutAnimation.configureNext(animation);
	}

	handleChangeText = (content) => {
		this.setState({
			content: content,
		});
	}

	saveReminder = async () => {
		//console.log('saving reminder');
		const {id, content, time, done, settingDueDate, dueDate, tagName} = this.state;
		var {notiID} = this.state;
		//console.log(dueDate);
		if (!content) return;

		let dueDateString = null;
		const now = new Date();

		// Schedule a local notification in the future, remove the previously scheduled on if exists
		if (settingDueDate) {
			dueDateString = dueDate.toISOString();
			// only send notifications if the due date's not passed
			if (dueDate.getTime() > now.getTime()){
				const newNotiID = Notifs.sendDelayedNotification ('Reminder', content, dueDate);
				if (notiID) Notifications.cancelScheduledNotificationAsync(notiID);
				notiID = newNotiID;
			} 
		} 

		const reminderData = {id, content, time, done, settingDueDate, dueDateString, tagName, notiID};
		await storeData(id, reminderData, 'allReminders'); 
		this.props.navigation.state.params.updateReminders();
	}

	setDueDate = newDate => {
		//console.log(newDate);
		this.setState({dueDate: newDate});
	}

	toggleReminderStatus = async (id, content, time, done, settingDueDate, dueDate, tagName, notiID) => {
		const {navigation, navigation: {state: {params: {toggleReminder}}}} = this.props;
		await toggleReminder(id, content, time, done, settingDueDate, dueDate, tagName, notiID);
		navigation.goBack();
	}

	render() {
		const {navigation, navigation: {state: {params: {toggleReminder}}}} = this.props;
		const {id, content, time, done, settingDueDate, dueDate, tagName, notiID, allTags} = this.state;

		const toggleText = done ? 'Mark as undone ' : 'Mark as done ';
		//console.log(this.state.dueDate);
		return (
			<KeyboardAvoidingView style={styles.container} behavior='padding'>
				<View>
					<View style={styles.contentBar}>
						<Text style={styles.textTitle}>Remind me to: </Text>
						<TextInput
							style={styles.textInput}
							value={content}
							onChangeText={(content) => this.handleChangeText(content)}
						/>
					</View>
					<View style={styles.contentBar}>
						<TagButton 
							tagName={tagName} 
							allTags={allTags} 
							updateTag={(tagName) => this.setState({tagName})}
						/>
					</View>
					<View style={styles.contentBar}>
						<Text style={styles.textTitle}>Set due date</Text>
						<Switch
							value={settingDueDate}
							onValueChange={(value) => this.setState({settingDueDate: value})}
						/>
					</View>
					{settingDueDate && Platform.OS === 'ios' &&
						<DueDatePickerIOS 
							dueDate={dueDate}
							setDueDate={this.setDueDate}
						/>
					}
					{settingDueDate && Platform.OS === 'android' &&
						<DueDatePickerAndroid 
							dueDate={dueDate}
							setDueDate={this.setDueDate}
						/>
					}
				</View>
				{toggleReminder && 
					<TouchableOpacity 
						style={styles.toggleButton}
						onPress={() => this.toggleReminderStatus(id, content, time, done, settingDueDate, dueDate, tagName, notiID)}
					>
						<Text style={styles.toggleText}>{toggleText}</Text>
					</TouchableOpacity>
				}
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#EFEEEE',
		paddingHorizontal: 15,
	},
	contentBar: {
		flexDirection: 'row', 
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 40,
		width: Dimensions.get('window').width - 20,
		marginTop: 10,
	},
	textTitle: {
		fontSize: 16,
		color: '#363636',
		fontFamily: 'AvenirNext-DemiBold',
	},
	textInput: {
		textAlignVertical: 'top',
		fontSize: 16,
		fontFamily: 'AvenirNext-Regular',
		color: '#363636',
		flex: 1,
		paddingHorizontal: 10,
		borderBottomColor: 'gainsboro',
    borderBottomWidth: StyleSheet.hairlineWidth,
	},
	toggleButton: {
		alignSelf: 'flex-end',
		justifyContent: 'center',
		marginTop: 20,
	},
	toggleText: {
		fontSize: 14, 
		fontFamily: 'AvenirNext-DemiBold',
		color: '#568EA6', 
		fontWeight: 'bold'
	},
});