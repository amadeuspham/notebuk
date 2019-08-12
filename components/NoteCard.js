import React from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert} from 'react-native';
import Swipeable from 'react-native-swipeable-row';
import { Ionicons } from '@expo/vector-icons';

import getDateStrings from '../utils/TimeManipulator';
import {deleteData} from '../utils/DataManager';
import store from '../store';

export default class NoteCard extends React.PureComponent {

	card = null;

	onDeleteRequest = async (title) => {
		Alert.alert(
		  'Delete note?',
		  'Are you sure you want to delete ' + title + '?',
		  [
		    {text: 'Yes, delete', onPress: this.deleteNote},
		    {
		      text: 'Cancel',
		      style: 'cancel',
		    },
		  ],
		  {cancelable: false},
		);
	}

	deleteNote = async () => {
		const {note: {id}, updateNotes} = this.props;
		await deleteData(id, 'allNotes');
		updateNotes();
	}

	handleUserSwipeList() {
		 this.card.recenter();
	}

	render() {
		const {openNote, note, tagColor, note: {title, content, time}} = this.props;

		var snippet = content ? content.substring(0, 125) : '';
		if (snippet.length >= 125) snippet += "...";

		const {dateStr} = getDateStrings(time);

		const rightButtons = [
			<TouchableOpacity 
				style={[styles.cardButton, {backgroundColor: 'red'}]}
				onPress={() => this.onDeleteRequest(title)}
			>
				<Ionicons 
					name='md-trash' 
					size={30} 
					style={{ color: 'white' }}
				/>
			</TouchableOpacity>
		];

		return (
			<Swipeable 
				onRef={ref => this.card = ref} 
				style={styles.card} 
				rightButtons={rightButtons}
				//onSwipeComplete={}
			>
				<TouchableOpacity
					onPress={() => openNote(note)}
					onLongPress={() => this.onDeleteRequest(title)}
				>
					<View style={styles.cardText}>
						<View style={styles.noteHeader}>
							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								{tagColor && <View style={[styles.tagDot, {backgroundColor: tagColor}]}/>}
								<Text style={styles.titleText}>{title}</Text>
							</View>
							<Text style={{fontSize: 14}}>{dateStr}</Text>
						</View>
						<Text style={styles.snippet}>{snippet}</Text>
					</View>
				</TouchableOpacity>
			</Swipeable>
		);
	}
}

const styles = StyleSheet.create({
	card: {
		height: 80,
		width: Dimensions.get('window').width,
		borderBottomColor: 'gainsboro',
    borderBottomWidth: 0.5,
	},
	cardButton: {
		height: 80,
		width: 80,
		borderBottomColor: 'gainsboro',
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
	},
	cardText: {
		padding: 10,
	},
	noteHeader: {
		height: 20,
		marginBottom: 5,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	tagDot: {
		width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
	},
	titleText: {
		fontSize: 16,
		color: 'black',
	},
	snippet: {
		fontSize: 12,
		color: 'grey',
	},
});