import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import SearchBar from 'react-native-searchbar';
import { MaterialIcons } from '@expo/vector-icons';

export default class SearchButton extends React.Component {

	render() {
		const {openSearchBar} = this.props;

		return (
			<View>
				<TouchableOpacity
					onPress={openSearchBar}
				>
					<MaterialIcons 
						name='search' 
						size={26} 
						style={{ color: 'dodgerblue' }}
					/>
				</TouchableOpacity>
				
			</View>
		);
	}
}