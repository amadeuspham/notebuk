import React from 'react';
import {View, StyleSheet, TouchableOpacity, StatusBar, Dimensions, Text, ActivityIndicator, Alert} from 'react-native';
import SearchBar from 'react-native-searchbar';

import { AntDesign } from '@expo/vector-icons';
import store from '../store';
import SearchButton from '../components/SearchButton';
import NoteList from '../components/NoteList';
import {fetchData, deleteData} from '../utils/DataManager';

export default class Book extends React.Component {
	static navigationOptions = ({navigation, navigation: {state: {params}} }) => {
		//console.log(navigation);
		const currentTag = params ? params.tagName : 'All notes';

		return ({
			title: 'Notebuk ',
			headerLeft: (
				<TouchableOpacity onPress={navigation.toggleDrawer}>
					<View style={styles.tagSection}>
						<AntDesign 
							name='tag' 
							size={25} 
							style={{ color: '#363636', marginLeft: 15, marginRight: 10 }}
						/>
						<Text style={styles.tagText}>{currentTag}</Text>
					</View>
				</TouchableOpacity>
			),
			headerRight: (
				<TouchableOpacity onPress={navigation.getParam('newNote')}>
					<AntDesign 
						name='plus' 
						size={25} 
						style={{ color: '#363636', marginRight: 15 }}
					/>
				</TouchableOpacity>
			),
		})
	};
// when notes are filtered, saving a note will delete notes that don't belong
	state = {
		data: null,
		filteredNotes: null,
		filtering: false,
		allTags: null,
		tagName: null,
		searching: store.getState().searching,
		searchResults: [],
		loading: true,
	};

	async componentDidMount(){
		const {navigation} = this.props;
		const {tagName} = this.state;

		this.unsubscribe = store.onChange(() => {
			this.setState({
				data: store.getState().notes, 
				allTags: store.getState().allTags,
				searching: store.getState().searching,
			});
		});

		navigation.setParams({ 'tagName': null });
		navigation.setParams({ 'newNote': this.newNote });
	}

	async componentDidUpdate(prevProps, prevState){
		const {navigation, navigation: {state: {params}}} = this.props;
		const {data} = this.state;
		const tagName = params.tagName == 'All' ? null : params.tagName;

		if (tagName !== this.state.tagName) {
	    this.setState({tagName});
	  }

	  if (this.state.tagName !== prevState.tagName) {
		  if (tagName) {
		  	//console.log('not all');
				const filteredNotes = data.filter(note => note.tagName === tagName);
				this.setState({filteredNotes, filtering: true});
		  } else {
		  	this.setState({filteredNotes: null, filtering: false});
		  }
		}

		if (this.state.searching !== prevState.searching && this.state.searching){
			this.searchBar.show();
		}

		if (this.state.data !== prevState.data && !prevState.data){
			this.setState({loading: false});
		}
	}

	componentWillUnmount() { 
		this.unsubscribe(); 
	}

	openSearchBar = () => {
		//this.setState({searching: true}, () => this.searchBar.show());
		store.setState({searching: true});
	}

	handleSearchResults = (results) => {
		this.setState({searchResults: results});
	}

	handleSearchBarHidden = () => {
		this.searchBar = null;
		this.setState({searchResults: []}, store.setState({searching: false}));
	}

	openNote = (noteData) => {
		const { navigation: { navigate } } = this.props;
		const {data, allTags} = this.state;
		navigate('Page', {
			data: noteData, 
			allTags: allTags,
			updateNotes: () => this.updateNotes(),
			onDeleteRequest: this.onDeleteRequest,
		});
	}

	newNote = () => {
		const { navigation: { navigate } } = this.props;
		const {data, allTags} = this.state;
		navigate('Page', {
			data: null,  
			allTags: allTags,
			updateNotes: () => this.updateNotes(),
			onDeleteRequest: this.onDeleteRequest,
		});
	}

	onDeleteRequest = async (title, id, navigation) => {
		const noteTitle = title ? title : 'this untitled note';
		Alert.alert(
		  'Delete note?',
		  'Are you sure you want to delete ' + noteTitle + '?',
		  [
		    {text: 'Yes, delete', onPress: () => this.deleteNote(id, navigation)},
		    {
		      text: 'Cancel',
		      style: 'cancel',
		    },
		  ],
		  {cancelable: false},
		);
	}

	deleteNote = async (id, navigation) => {
		await deleteData(id, 'allNotes');
		if (navigation) navigation.goBack();
		this.updateNotes();
	}

	updateNotes = async() => {
		const allNotesUpdated = await fetchData('allNotes');
		store.setState({notes: allNotesUpdated});
	}

	render() {
		const {data, allTags, filtering, filteredNotes, searching, searchResults, loading} = this.state;

		let dataDisplaying = [];
		if (filtering) {
			dataDisplaying = filteredNotes;
		} else if (searching) {
			dataDisplaying = searchResults;
		} else if (data) {
			dataDisplaying = data;
		}
		//console.log(data);
		return (
			<View style={styles.container}>
				<StatusBar barStyle="dark-content"/>
			  <View style={styles.header}>
			  	{!searching &&
				  	<SearchButton openSearchBar={this.openSearchBar}/>
			  	}
					<SearchBar
					  ref={(ref) => this.searchBar = ref}
					  data={data}
					  handleResults={this.handleSearchResults}
					  onHide={this.handleSearchBarHidden}
					  fontSize={16}
					  heightAdjust={-10}
					  iOSPadding={false}
					  iOSHideShadow={true}
					/>
				</View>
				<View style={[styles.noteList, searching && {marginTop: 50}]}>
					{loading &&
						<View style={{justifyContent: 'center', alignItems: 'center'}}>
							<ActivityIndicator color='#F1D1B5'/>
							<Text style={styles.noNoteText}>Loading your notes</Text>
						</View>
					}
					{dataDisplaying.length === 0 && !loading && !searching &&
						<Text style={styles.noNoteText}>You don't have any note. Write some!</Text>
					}
					{dataDisplaying.length !== 0 && !loading &&
						<NoteList
							data={dataDisplaying}
							allTags={allTags}
							openNote={this.openNote}
							onDeleteRequest={this.onDeleteRequest}
						/>
					}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#EFEEEE',
	},
	tagSection: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	tagText: {
		color: '#363636',
		fontSize: 16,
		fontFamily: 'AvenirNext-Regular',
	},
	header: {
		position: 'absolute',
		zIndex: 1,
		backgroundColor: 'transparent',
		marginTop: 5,
		top: 0,
		width: Dimensions.get('window').width,
		alignItems: 'center',
		shadowOffset: {width: 8,height: 8},
    shadowOpacity: 0.1,
	},
	noNoteText: {
		color: 'grey',
		fontSize: 16,
		fontFamily: 'AvenirNext-Regular',
	},
	noteList: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});