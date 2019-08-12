import React from 'react';
import {StyleSheet, FlatList, LayoutAnimation} from 'react-native';

import ReminderCard from '../components/ReminderCard';
import store from '../store';

export default class RemindersList extends React.PureComponent {

	componentDidUpdate(){
		const animation = LayoutAnimation.create(
			200,
			LayoutAnimation.Types.easeInEaseOut,
			LayoutAnimation.Properties.scaleY,
		);

		LayoutAnimation.configureNext(animation);
	}

	keyExtractor = (item, index) => item.id;

	renderItem = (reminder) => {
		const {updateReminders, openReminder} = this.props;
		const allTags = store.getState().allTags;
		
		return (
			<ReminderCard
				allTags={allTags}
				id={reminder.id}
				reminder={reminder.item}
				openReminder={openReminder}
				updateReminders={updateReminders}
			/>
		);
	};

	render() {
		const {reminders} = this.props;

		return(
			<FlatList
				style={styles.reminderList}
				data={reminders}
				keyExtractor={this.keyExtractor}
				renderItem={this.renderItem}
				//onScrollBeginDrag
			/>
		);
	}
}

const styles = StyleSheet.create({
	reminderList: {
		flex: 1,
	},
});