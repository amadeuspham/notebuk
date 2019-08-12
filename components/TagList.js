import React from 'react';
import {
	View, 
	Text, 
	StyleSheet, 
	Platform, 
	TouchableOpacity, 
	FlatList, 
	Modal,
	KeyboardAvoidingView,
} from 'react-native';
import {SafeAreaView} from 'react-navigation';

import NewTagBox from './NewTagBox';
import TagCard from './TagCard';
import { EvilIcons, AntDesign } from '@expo/vector-icons';
import {saveData, fetchData} from '../utils/DataManager';
import store from '../store';

export default class TagList extends React.Component {

	state =  {
		currentRoute: store.getState().currentRoute,
		allTags: store.getState().allTags,
		//allNotes: store.getState().notes,
		//allReminders: store.getState().reminders,
		searching: store.getState().searching,
		creatingNew: false,
		editMode: false,
		editingTagName: null,
		editingTagColor: null,
	};

	async componentDidMount(){
		this.unsubscribe = store.onChange(() => 
			{
				this.setState({
					currentRoute: store.getState().currentRoute,
					allTags: store.getState().allTags,
					searching: store.getState().searching,
				})
			}
		);

		var allTags = await fetchData('allTags');
		var allNotes = await fetchData('allNotes');
		var allReminders = await fetchData('allReminders');

		allTags = allTags ? allTags : [],
		allNotes = allNotes ? allNotes : [],
		allReminders = allReminders ? allReminders : [],

		store.setState({allTags, notes: allNotes, reminders: allReminders});
	}

	//async componentDidUpdate(prevProps, prevState) {
	//	if (this.state.allTags !== prevState.allTags) {
	//		await saveData('allTags', this.state.allTags);
	//	}
	//}

	componentWillUnmount(){
		this.unsubscribe();
	}

	filterTag = (tagName) => {
		const {navigation, navigation: {navigate}} = this.props;
		const {currentRoute} = this.state;

		navigation.toggleDrawer();
		//console.log('currently at: ' + currentRoute);
		if (currentRoute === 'Book' || currentRoute === 'Notebuk') {
			navigate('Book', {tagName: tagName});
		} else if (currentRoute === 'Reminders') {
			navigate('ReminderWindow', {tagName: tagName});
		}
	}

	keyExtractor = (tag, index) => tag.name;

	renderItem = tag => {
		const {choosing, updateTag, onClose} = this.props;
		const {name, color} = tag.item; 

		return(
			<TagCard 
				name={name} 
				color={color} 
				choosing={choosing}
				filterTag={this.filterTag}
				updateTag={updateTag}
				openEditBox={() => this.openNewTagBox(true, name, color)}
				deleteTag={this.deleteTag}
				onClose={onClose}
			/>
		);
	};

	saveTags = async () => {
		const {allTags} = this.state;
		//console.log(allTags);
		await saveData('allTags', allTags);
	}

	openNewTagBox = (editMode, editingTagName, editingTagColor) => {
		//console.log(editMode);
		this.setState({
			creatingNew: true, 
			editMode,
			editingTagName,
			editingTagColor,
		});
	}

	closeNewTagBox = () => {
		this.setState({
			creatingNew: false, 
			editMode: false,
			editingTagName: null,
			editingTagColor: null,
		});
	}

	createNewTag = async (tagName, tagColor) => {
		const {allTags} = this.state;

		const newTag = {name: tagName, color: tagColor};
		await saveData('allTags', [...allTags, newTag]);

		store.setState({
			allTags: [...allTags, newTag],
		});
	}

	updateTags = async() => {
		const allTagsUpdated = await fetchData('allTags');
		store.setState({allTags: allTagsUpdated});
	}

	changeAllNotesOfTag = (oldName, oldColor, newName, newColor) => {
		const {allTags} = this.state;
		const allNotes = store.getState().notes;
		const	allReminders = store.getState().reminders;

		var all_tags = JSON.parse(JSON.stringify(allTags));
		all_tags.forEach((tag) => {
			if (tag.name === oldName || tag.color === oldColor){
				tag.name = newName;
				tag.color = newColor;
			} 
		});

		var all_notes = JSON.parse(JSON.stringify(allNotes));
		all_notes.forEach((note) => {
			if (note.tagName === oldName) note.tagName = newName;
		});

		var all_reminders = JSON.parse(JSON.stringify(allReminders));
		all_reminders.forEach((reminder) => {
			if (reminder.tagName === oldName) reminder.tagName = newName;
		});

		store.setState({notes: all_notes, allTags: all_tags, reminders: all_reminders});
	}

	deleteTag = async (tagName, keepData) => {
		const {allTags} = this.state;
		const allNotes = store.getState().notes;
		const	allReminders = store.getState().reminders;

		const remainingTags = allTags.filter(tag => tag.name !== tagName);
		var remainingNotes = [];
		var remainingReminders = [];

		if (keepData) {
			var all_notes = JSON.parse(JSON.stringify(allNotes));
			var all_reminders = JSON.parse(JSON.stringify(allReminders));

			all_notes.forEach((note) => {
				if (note.tagName === tagName) note.tagName = null;
			});
			all_reminders.forEach((reminder) => {
				if (reminder.tagName === tagName) reminder.tagName = null;
			});

			remainingNotes = all_notes;
			remainingReminders = all_reminders;
		} else {
			remainingNotes = allNotes.filter(note => note.tagName !== tagName);
			remainingReminders = allReminders.filter(reminder => reminder.tagName !== tagName);
		}

		await saveData('allTags', remainingTags);
		await saveData('allNotes', remainingNotes);
		await saveData('allReminders', remainingReminders);

		store.setState({
			allTags: remainingTags,
			notes: remainingNotes,
			reminders: remainingReminders,
		});
	}

	render(){
		const {choosing, onClose} = this.props;
		const {searching} = this.state;

		if (searching) return (
			<SafeAreaView 
				style={[
					styles.container, 
					{alignItems: 'center'},
				]}
			>
				<Text 
					style={{
						fontSize: 16, 
						color: 'grey', 
						marginTop: Platform.OS === 'ios' ? 15 : 30,
						marginLeft: Platform.OS === 'ios' ? 0 : 20,
					}}
				>
					Tag filtering is not available when searching for notes
				</Text>
			</SafeAreaView>
		);

		const {allTags, creatingNew, editMode, editingTagName, editingTagColor} = this.state;

		return(
			<SafeAreaView style={[styles.container, creatingNew ? {backgroundColor: 'rgba(0,0,0,0.5)'} : '']}>
				{choosing &&
					<View>
						<AntDesign 
							name='close' 
							size={20} 
							style={{marginLeft: 10 }}
							onPress={onClose}
						/>
						<Text style={{fontSize: 20, alignSelf: 'center'}}>Choose a tag for your note</Text>
					</View>
				}
				<FlatList
					style={styles.tagList}
					data={allTags}
					keyExtractor={this.keyExtractor}
					renderItem={this.renderItem}
				/>
				{ !choosing &&
				<TouchableOpacity onPress={() => this.filterTag('All notes')}>
					<View style={styles.tagCard}>
						<AntDesign 
							name='tags' 
							size={25} 
							style={{ color: 'black', marginRight: 10 }}
						/>
						<Text style={{fontSize: 16}}>All notes</Text>
					</View>
				</TouchableOpacity>
				}
				<TouchableOpacity onPress={() => this.openNewTagBox(false, false, false)}>
					<View style={styles.tagCard}>
						<EvilIcons 
							name='plus' 
							size={25} 
							style={{ color: 'black', marginRight: 10 }}
						/>
						<Text style={{fontSize: 16}}>New tag</Text>
					</View>
				</TouchableOpacity>
				<Modal 
					visible={creatingNew} 
					animationType='slide' 
					transparent={true}
				>
					<SafeAreaView>
						<KeyboardAvoidingView 
							style={{justifyContent: 'center', alignItems: 'center'}}
							behavior={Platform.OS === 'ios' ? 'padding' : undefined}
						>
							<NewTagBox
								createNewTag={this.createNewTag}
								editMode={editMode}
								editingTagName={editingTagName}
								editingTagColor={editingTagColor}
								changeAllNotesOfTag={this.changeAllNotesOfTag}
								onClose={this.closeNewTagBox}
								onRequestClose={this.closeNewTagBox}
						  />
					  </KeyboardAvoidingView>
				  </SafeAreaView>
				</Modal>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		marginBottom: 20,
	},
	tagList: {
		flex: 1,
		//backgroundColor: 'red',
	},
	tagCard: {
		height: 50,
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
	},
});