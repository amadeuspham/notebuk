let state = {
  allTags: [],
  notes: [],
  reminders: [],
  searching: false,
  currentRoute: 'Book',
  allFontsLoaded: false,
  selectNotesMode: false,
};

var listeners = [];

export default {
  getState() {
    return state;
  },
  setState(newState) {
    state = { ...state, ...newState };
    //console.log(state.allTags);
    listeners.forEach(listener => listener());
  },
  onChange(newListener) {
    //console.log('update from listener');
    listeners.push(newListener);
    return () => listeners = listeners.filter(listener => listener !== newListener);
  },
};
