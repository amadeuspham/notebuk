import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default class SearchButton extends React.Component {

	render() {
		const {openSearchBar} = this.props;

		return (
			<View>
				<TouchableOpacity
					onPress={openSearchBar}
					style={styles.container}
				>
					<MaterialIcons 
						name='search' 
						size={26} 
						style={{ color: '#305F72' }}
					/>
				</TouchableOpacity>
				
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		//height: 20,
		elevation: 7,
		padding: 15,
		borderRadius: 30,
		backgroundColor: 'white',
	},
});