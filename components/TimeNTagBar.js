import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import TagButton from '../components/TagButton';
import getDateStrings from '../utils/TimeManipulator';

export default class TimeNTagBar extends React.PureComponent {

	render(){
		const {time, tagName, allTags, updateTag} = this.props;
		const {dateStr, timeStr} = getDateStrings(time);

		return (
			<View style={styles.container}>
				<TagButton tagName={tagName} allTags={allTags} updateTag={updateTag}/>
				<Text style={styles.timeText}>
					{dateStr + '  ' + timeStr}
				</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		width: Dimensions.get('window').width,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		marginTop: 10,
	},
	timeText: {
		fontSize: 14,
		color: 'grey',
		fontFamily: 'AvenirNext-Regular',
	},
});