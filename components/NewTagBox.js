import React from 'react';
import {
	TouchableOpacity, 
	Text, 
	View, 
	TextInput, 
	StyleSheet, 
	Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
//import { TriangleColorPicker } from 'react-native-color-picker';
import ColorPalette from 'react-native-color-palette';

import tagColors from '../utils/tagColors';

export default class NewTagBox extends React.Component {
	
	constructor(props){
		super(props);
		const {editMode, editingTagName, editingTagColor} = this.props;

		this.state = {
			oldName: editMode ? editingTagName : null,
			oldColor: editMode ? editingTagColor : null,
			tagName: editMode ? editingTagName : null,
			tagColor: editMode ? editingTagColor : '#e6194b',
		}
	}

	onOKPressed = () => {
		const {createNewTag, onClose, editMode, changeAllNotesOfTag} = this.props;
		const {oldName, oldColor, tagName, tagColor} = this.state;

		editMode ? 
			changeAllNotesOfTag(oldName, oldColor, tagName, tagColor) 
			: createNewTag(tagName, tagColor);

		onClose();
	}

	handleChangeName = tagName => {
		this.setState({tagName});
	}

	render() {
		const {editMode, onClose} = this.props;
		const {tagName, tagColor} = this.state;

		return (
			<View style={styles.container}>
				<View style={styles.tagInputContainer}>
					<Text style={styles.title}>Pick a name:</Text>
					<TextInput
						style={styles.tagNameInput}
						placeholder="Enter your new tag name"
						value={tagName}
						underlineColorAndroid="transparent"
						onChangeText={this.handleChangeName}
					/>
				</View>
				<Text style={styles.title}>Pick a color:</Text>
			  <ColorPalette
			  	//paletteStyles={{backgroundColor: 'green'}}
		      onChange={color => this.setState({tagColor: color})}
		      defaultColor={tagColor}
		      colors={tagColors}
		      title={""}
		      icon={
		        <MaterialIcons name={'check'} size={25} color={'white'} />
			    }
			  />
			  {editMode && 
				  <Text style={[styles.title, {marginBottom: 10}]}>
				  	All notes and reminders with the old tag will be updated.
				  </Text>
				}
				<View style={styles.buttonRow}>
					<TouchableOpacity onPress={onClose}>
						<Text style={styles.textButton}>Cancel</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={this.onOKPressed}>
						<Text style={styles.textButton}>OK</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		//flex: 1,
		justifyContent: 'center',
		padding: 20,
		backgroundColor: 'white',
	},
	title: {
		fontSize: 16,
		fontFamily: 'AvenirNext-Regular',
	},
	tagInputContainer: {
		marginBottom: 20,
	},
	tagNameInput: {
		borderBottomColor: 'lightgrey',
    borderBottomWidth: StyleSheet.hairlineWidth,
    fontSize: 16,
    fontFamily: 'AvenirNext-Regular',
    marginTop: 10,
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	textButton: {
		fontSize: 16,
		color: '#568EA6',
		fontFamily: 'AvenirNext-DemiBold',
	},
});