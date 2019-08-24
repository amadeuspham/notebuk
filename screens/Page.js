import React from 'react';
import {StyleSheet, TextInput, Dimensions, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import uuidv4 from 'uuid/v4';
import { Ionicons } from '@expo/vector-icons';

import TimeNTagBar from '../components/TimeNTagBar';
import {storeData} from '../utils/DataManager';
import store from '../store';

export default class Page extends React.Component {
	static navigationOptions = ({navigation, navigation: {state: {params}}}) => {
		const {data, onDeleteRequest, changingTitle} = params;

		var noteTitle = 'New note';
		if (changingTitle) {
			noteTitle = changingTitle;
		} else if (data) {
			noteTitle = data.title;
		}

		return {
			title: noteTitle,
			headerLeft: (
	      <TouchableOpacity 
	      	onPress={() => {
	      		const saveNote = navigation.getParam('saveNote');
	      		saveNote();
	      		navigation.goBack();
	      	}}
	      >
	      	<Ionicons 
						name='ios-arrow-back' 
						size={30} 
						style={{ marginLeft: 20, color: '#363636' }}
					/>
	      </TouchableOpacity>
	    ),
			headerRight: (
	      <TouchableOpacity 
	      	onPress={() => {
	      		onDeleteRequest(
	      			data ? data.title : 'this note', 
	      			navigation.getParam('id'), 
	      			navigation
	      		);
	      	}}
	      >
	      	<Ionicons 
						name='md-trash' 
						size={25} 
						style={{ marginRight: 20, color: '#363636' }}
					/>
	      </TouchableOpacity>
	    ),
		};
	}

	constructor(props){
		super(props);

		var now = new Date();
		const dateString = now.toISOString();

		this.state = {
			id: uuidv4(),
			title: null,
			content: null,
			time: dateString,
			tagName: null,
			//typing: false,
			typingTỉmeout: 0,
			allTags: store.getState().allTags,
		};
	}

	async componentDidMount(){
		const {navigation, navigation: {state: {params}}} = this.props;
		const {data} = params;

		navigation.setParams({ 'saveNote': this.saveNote });

		this.unsubscribe = store.onChange(() => 
			{
				this.setState({allTags: store.getState().allTags})
			}
		);

		if (data === null) {
			navigation.setParams({ 'id': this.state.id });
			return;
		} 

		const {id, title, content, time, tagName} = data;

		this.setState({
			id,
			title,
			content,
			time,
			tagName,
		}, () => navigation.setParams({ 'id': id }));
	};

	componentWillUnmount(){
		this.unsubscribe();
	}

	async componentDidUpdate(prevProps, prevState){
		if (this.state.tagName !== prevState.tagName){
			this.saveNote();
		}
	}

	handleChangeText = (text, fromField) => {
		const { navigation: { navigate } } = this.props;
		var {typingTimeout} = this.state;

		if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

		if (fromField == 'title') {
			this.setState({
				title: text,
				typingTimeout: setTimeout(this.saveNote, 2000),
			}, () => navigate('Page', {
			changingTitle: text,
			}));
		} else {
			this.setState({
				content: text,
				typingTimeout: setTimeout(this.saveNote, 2000),
			});
		}
	}

	saveNote = async () => {
		//console.log('saving note'); 
		const {id, title, content, time, tagName} = this.state;
		if (!title && !content) return;
		const noteData = {id, title, content, time, tagName};
		await storeData(id, noteData, 'allNotes');
		this.props.navigation.state.params.updateNotes();
	}

	render() {
		const {title, content, time, tagName, allTags} = this.state;

		//const tagColor = allTags.filter(tag => tag.name === tagName)[0].color;

		return (
			<KeyboardAvoidingView style={styles.container} behavior='height'>
				<TextInput
					style={[styles.textInput, {fontFamily: 'AvenirNext-DemiBold',}]}
					placeholder={'Title'}
					value={title}
					onChangeText={(title) => this.handleChangeText(title, 'title')}
					multiline={true}
				/>
				<TimeNTagBar 
					time={time} 
					tagName={tagName} 
					allTags={allTags} 
					updateTag={(tagName) => this.setState({tagName})}
				/>
				<TextInput
					style={[styles.textInput, {flex: 1, marginBottom: 100, fontSize: 16}]}
					value={content}
					placeholder={'Content'}
					onChangeText={(content) => this.handleChangeText(content, 'content')}
					multiline={true}
				/>
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#EFEEEE',
		justifyContent: 'center',
		alignItems: 'center',
	},
	textInput: {
		textAlignVertical: 'top',
		fontSize: 20,
		height: 40,
		width: Dimensions.get('window').width - 20,
		paddingHorizontal: 10,
		marginTop: 10,
		borderBottomColor: 'gainsboro',
    borderBottomWidth: StyleSheet.hairlineWidth,
    fontFamily: 'AvenirNext-Regular',
	},
	headerButtonText: {
		marginLeft: 15,
		fontSize: 18,
		color: '#097DFF',
	},
});