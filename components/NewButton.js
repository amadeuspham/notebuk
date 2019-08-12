import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default class NewButton extends React.Component {
	render() {
		const {newNote} = this.props;

		return (
			<View style={styles.container}>
				<TouchableOpacity
					onPress={newNote}
				>
					<MaterialCommunityIcons 
						name='pencil-box' 
						size={26} 
						style={{ color: 'dodgerblue' }}
					/>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		//justifyContent: 'center',
		alignItems: 'center',
	},
});