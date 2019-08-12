import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Modal, SafeAreaView} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import TagList from '../components/TagList';
import lightOrDark from '../utils/lightOrDark';

export default class TagButton extends React.Component{
	state = {
		choosingTag: false,
	};

	render(){
		const {tagName, allTags, updateTag} = this.props;
		const {choosingTag} = this.state;
		//console.log(tagName);
		//console.log(allTags);
		const tagColor = allTags && tagName ? allTags.filter(tag => tag.name === tagName)[0].color : 'grey';
		//console.log(tagName, tagColor);
		const lightness = lightOrDark(tagColor);
		const contentColor = lightness == 'light' ? 'black' : 'white';

		return(
			<View>
				<TouchableOpacity 
					style={[styles.tagButton, {backgroundColor: tagColor}]}
					onPress={() => this.setState({choosingTag: true})}
				>
					<AntDesign 
						name='tag' 
						size={12} 
						style={{ color: contentColor, marginRight: 5 }}
					/>
					<Text style={{fontSize: 12, color: contentColor}}>
						{tagName ? tagName : 'No tag'}
					</Text>
				</TouchableOpacity>
				<Modal 
					visible={choosingTag} 
					animationType='slide'
					onRequestClose={() => this.setState({choosingTag: false})}
				>
					<TagList 
						choosing={true} 
						updateTag={updateTag}
						onClose={() => this.setState({choosingTag: false})}
					/>
				</Modal>
			</View>
	);
	}
}

const styles = StyleSheet.create({
	tagButton: {
		padding: 5,
		borderRadius: 5,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});