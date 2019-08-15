import React from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert} from 'react-native';

import getDateStrings from '../utils/TimeManipulator';
import {deleteData} from '../utils/DataManager';

export default class NoteCard extends React.PureComponent {

	card = null;

	handleUserSwipeList() {
		 this.card.recenter();
	}

	render() {
		const {openNote, note, tagColor, onDeleteRequest, note: {id, title, content, time}} = this.props;
		const {dateStr} = getDateStrings(time);

		return (
			<TouchableOpacity
				style={styles.card} 
				onPress={() => openNote(note, this.onDeleteRequest)}
				onLongPress={() => onDeleteRequest(title, id)}
			>
				<View style={styles.cardText}>
					<View style={styles.noteHeader}>
						<View style={{flexDirection: 'row', alignItems: 'center'}}>
							{tagColor && <View style={[styles.tagDot, {backgroundColor: tagColor}]}/>}
							<Text style={styles.titleText}>{title}</Text>
						</View>
						<Text style={styles.timeText}>{dateStr}</Text>
					</View>
					<Text 
						style={styles.snippet}
						numberOfLines={2}
						ellipsizeMode='tail'
					>
						{content}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	card: {
		zIndex: 1,
		height: 80,
		width: Dimensions.get('window').width - 40,
		borderColor: 'gainsboro',
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 20,
    backgroundColor: 'white',
    shadowOffset: {width: 10,height: 10},
    shadowOpacity: 0.1,
    elevation: 5,
    //overflow: 'visible',
    //elevation: 8,
	},
	cardButton: {
		height: 80,
		width: 80,
		borderColor: 'gainsboro',
    borderWidth: StyleSheet.hairlineWidth,
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
		fontFamily: 'AvenirNext-DemiBold',
	},
	timeText: {
		fontSize: 14,
		fontFamily: 'AvenirNext-Regular',
	},
	snippet: {
		fontSize: 12,
		fontFamily: 'AvenirNext-Regular',
		color: 'grey',
	},
});