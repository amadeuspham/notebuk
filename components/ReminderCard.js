import React from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert} from 'react-native';
import Swipeable from 'react-native-swipeable-row';
import { Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';

import getDateStrings from '../utils/TimeManipulator';
import {deleteData, storeData} from '../utils/DataManager';
import lightOrDark from '../utils/lightOrDark';

export default class ReminderCard extends React.Component {

	finishReminder = async (reminder) => {
		const {reminder: {id}, updateReminders} = this.props;
		reminder.done = true;
		await storeData(id, reminder, 'allReminders');
		await updateReminders();
	}

	onDeleteRequest = async (reminder) => {
		Alert.alert(
		  'Delete reminder?',
		  null,
		  [
		    {text: 'Yes, delete', onPress: () => this.deleteReminder(reminder)},
		    {
		      text: 'Cancel',
		      style: 'cancel',
		    },
		  ],
		  {cancelable: false},
		);
	}

	deleteReminder = async (reminder) => {
		//console.log(reminder);
		const {reminder: {id}, updateReminders} = this.props;
		await deleteData(id, 'allReminders');
		await updateReminders();
	}

	render() {
		const {allTags, reminder, reminder: {content, done, dueDateString, tagName}, openReminder} = this.props;
		//console.log(tagName);
		const tagColor = allTags && tagName ? allTags.filter(tag => tag.name === tagName)[0].color : 'grey';
		const lightness = lightOrDark(tagColor);
		const contentColor = lightness == 'light' ? 'black' : 'white';

		const doneBackground = {
			backgroundColor: null,
		};
		const notDoneBackground = {
			backgroundColor: tagColor,
		};
		const doneText = {
			textDecorationLine: 'line-through',
			color: tagColor,
		};
		const notDoneText = {
			color: contentColor,
		};

		const dateNTime = getDateStrings(dueDateString);
		const dueDate = new Date(dueDateString);
		const now = new Date();

		const FinishBar = (
			<View style={[styles.extraBar,{
				backgroundColor: 'lightcyan', 
				alignItems: 'flex-end',
				paddingRight: 10,
			}]}>
				<Ionicons 
					name='ios-checkmark' 
					size={25} 
					color='dodgerblue'
				/>
			</View>
		);

		const DeleteBar = (
			<View style={[styles.extraBar,{
				backgroundColor: 'mistyrose', 
				alignItems: 'flex-start',
				paddingLeft: 5,
			}]}>
				<Entypo 
					name='cross' 
					size={20} 
					color='red'
				/>
			</View>
		);

		return (
			<Swipeable 
				onRef={ref => this.card = ref} 
				leftContent={done ? null : FinishBar}
				rightContent={DeleteBar}
				onRightActionRelease={() => this.onDeleteRequest(reminder)}
				onLeftActionRelease={done ? null : () => this.finishReminder(reminder)}
				style={[styles.card, done ? doneBackground : notDoneBackground]} 
			>
				<TouchableOpacity
					style={styles.cardContent}
					onPress={() => openReminder(reminder, dueDate)}
				>
					<View style={{flexDirection: 'row'}}>
						{dueDate.getTime() <= now.getTime() && dueDate.getTime() !== 0 && !done &&
							<MaterialIcons 
								name='assignment-late' 
								size={20} 
								color={contentColor}
								style={{marginRight: 5}}
							/>
						}
						<Text style={done ? doneText : notDoneText}>
							{content}
						</Text>
					</View>
					{dateNTime &&
						<Text style={done ? doneText : notDoneText}>
							{dateNTime.dateStr + ' ' + dateNTime.timeStr}
						</Text>
					}
				</TouchableOpacity>
			</Swipeable>
		);
	}
}

const styles = StyleSheet.create({
	card: {
		height: 30,
		width: Dimensions.get('window').width - 20,
		marginTop: 10,
		alignItems: 'center',
	},
	cardContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 5,
		//alignItems: 'center',
	},
	extraBar: {
		flex: 1,
		justifyContent: 'center',
	},
});