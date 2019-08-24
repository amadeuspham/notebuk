import React from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import getDateStrings from '../utils/TimeManipulator';
import {deleteData} from '../utils/DataManager';

export default class NoteCard extends React.PureComponent {

	card = null;

	handleUserSwipeList() {
		 this.card.recenter();
	}

	render() {
		const {
			openNote, 
			note, 
			tagColor, 
			selectNote, 
			selectMode,
			selected, 
			note: {id, title, content, time},
		} = this.props;
		const {dateStr} = getDateStrings(time);

		return (
			<TouchableOpacity
				style={styles.card} 
				onPress={selectMode ? () => selectNote(id) : () => openNote(note, this.onDeleteRequest)}
				onLongPress={() => selectNote(id)}
			>
				{selected &&
					<AntDesign 
						name='check' 
						size={30} 
						style={{ backgroundColor: '#568EA6', padding: 25, color: '#EFEEEE' }}
					/>
				}
				<View style={styles.cardText}>
					<View 
						style={[
							styles.noteHeader, 
							selected ? 
							{width: Dimensions.get('window').width - 140} : 
							{width: Dimensions.get('window').width - 60}
						]}
					>
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
    marginTop: 20,
    backgroundColor: 'white',
    shadowOffset: {width: 10,height: 10},
    shadowOpacity: 0.1,
    elevation: 5,
    flexDirection: 'row',
	},
	cardText: {
		padding: 10,
	},
	noteHeader: {
		width: Dimensions.get('window').width - 60,
		marginBottom: 5,
		flexDirection: 'row',
		alignItems: 'center',
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
		color: '#363636',
		fontFamily: 'AvenirNext-DemiBold',
	},
	timeText: {
		fontSize: 14,
		color: '#363636',
		fontFamily: 'AvenirNext-Regular',
	},
	snippet: {
		fontSize: 12,
		fontFamily: 'AvenirNext-Regular',
		color: 'grey',
	},
});