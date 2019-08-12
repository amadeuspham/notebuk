import React from 'react';
import {
	View, 
	Text, 
	StyleSheet, 
	Alert, 
	TouchableOpacity, 
	Button,
} from 'react-native';

export default class TagCard extends React.PureComponent {

	requestDeleteTag = () => {
		const {name, deleteTag} = this.props;

		Alert.alert(
		  'Do you want to keep the notes and reminders associated with tag ' + name +'?',
		  'If yes, they will not be tagged anymore. If not, they will be deleted.',
		  [
		  	{text: 'Yes', onPress: () => deleteTag(name, true)},
		    {text: 'No', onPress: () => deleteTag(name, false)},
		    {
		      text: 'Cancel',
		      style: 'cancel',
		    },
		  ],
		  {cancelable: false},
		);
	}

	onLongPress = () => {
		const {name, openEditBox} = this.props;

		Alert.alert(
		  'Edit or delete tag?',
		  'What would you like to do with tag ' + name + '?',
		  [
		  	{text: 'Edit', onPress: openEditBox},
		    {text: 'Delete', onPress: this.requestDeleteTag},
		    {
		      text: 'Cancel',
		      style: 'cancel',
		    },
		  ],
		  {cancelable: false},
		);
	}

	render(){
		const {choosing, filterTag, updateTag, deleteTag, name, color, onClose, routeName} = this.props; 

		let filtering = null;
		if (routeName === 'Book') {
			filtering = 'notes';
		} else if (routeName === 'ReminderWindow') {
			filtering = 'reminders';
		}

		return(
			<TouchableOpacity
				onPress={
					choosing ? 
					() => {
						updateTag(name);
						onClose();
					} 
					: () => filterTag(name)}
				onLongPress={this.onLongPress}
			>
				<View style={styles.tagCard}>
					{color && <View style={[styles.tagDot, {backgroundColor: color}]}/>}
					<Text style={{fontSize: 16}}>{name}</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	tagCard: {
		height: 50,
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
	},
	tagDot: {
		width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
	},
});