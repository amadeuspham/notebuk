import React from 'react';
import {StyleSheet, FlatList, LayoutAnimation} from 'react-native';

import NoteCard from '../components/NoteCard';

export default class NoteList extends React.PureComponent {

	componentDidUpdate(){
		const animation = LayoutAnimation.create(
			200,
			LayoutAnimation.Types.easeInEaseOut,
			LayoutAnimation.Properties.scaleY,
		);

		LayoutAnimation.configureNext(animation);
	}

	keyExtractor = (item, index) => item.id;

	renderItem = (note) => {
		const {openNote, allTags, onDeleteRequest} = this.props;
		const {tagName} = note.item;
		console.log(allTags);
		const tagColor = allTags && tagName ? allTags.filter(tag => tag.name === tagName)[0].color : null;
		//console.log(tagColor);
		return(
			<NoteCard
				id={note.id}
				note={note.item}
				tagColor={tagColor}
				openNote={openNote}
				onDeleteRequest={onDeleteRequest}
			/>
		);
	};

	render() {
		const {data} = this.props;

		return(
			<FlatList
				style={styles.noteList}
				data={data}
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