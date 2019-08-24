import React from 'react';
import {StyleSheet, FlatList, LayoutAnimation} from 'react-native';

import NoteCard from '../components/NoteCard';
import store from '../store';

export default class NoteList extends React.PureComponent {
	componentDidMount() {
		this.unsubscribe = store.onChange(() => {
			this.setState({
				selectMode: store.getState().selectNotesMode,
			});
		});
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	componentDidUpdate(prevProps, prevState){
		if (prevState.selectMode !== this.state.selectMode && this.state.selectMode === false) {
			this.setState({selected: (new Map(): Map<string, boolean>)});
		}

		const animation = LayoutAnimation.create(
			200,
			LayoutAnimation.Types.easeInEaseOut,
			LayoutAnimation.Properties.scaleY,
		);

		LayoutAnimation.configureNext(animation);
	}

	state = {
		selectMode: store.getState().selectNotesMode,
		selected: (new Map(): Map<string, boolean>),
	};

	keyExtractor = (item, index) => item.id;

	selectNote = (id) => {
		const {selectingNotes} = this.props;
		const {selected} = this.state;

		let notesSelectedNum = 0;
    let selectMode = false;
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      // count the number of selected notes, change selectm mode to true if needed
      selected.forEach((value) => {
      	if (value) {
      		notesSelectedNum += 1;
      		if (!selectMode) selectMode = true;
      	}
	    });

      return {selected};
    }, () => {
    	if (this.state.selectMode !== selectMode) {
    		store.setState({selectNotesMode: selectMode});
    	}
    	selectingNotes(notesSelectedNum, this.state.selected);
    });
  };

	renderItem = (note) => {
		const {openNote, allTags} = this.props;
		const {selectMode, selected} = this.state;
		const {tagName} = note.item;
		//console.log(allTags);
		const tagColor = allTags && tagName ? allTags.filter(tag => tag.name === tagName)[0].color : null;
		//console.log(selected);

		return(
			<NoteCard
				note={note.item}
				tagColor={tagColor}
				openNote={openNote}
				selectNote={this.selectNote}
				selectMode={selectMode}
				selected={selected.get(note.item.id)}
			/>
		);
	};

	render() {
		const {data} = this.props;

		return(
			<FlatList
				style={styles.noteList}
				data={data}
				extraData={this.state}
				keyExtractor={this.keyExtractor}
				renderItem={this.renderItem}
				//onScrollBeginDrag
			/>
		);
	}
}

const styles = StyleSheet.create({
	noteList: {
		flex: 1,
		paddingHorizontal: 20,
	},
});