import {AsyncStorage} from 'react-native';

export const fetchData = async(key) => {
	try {
    const allNotes = await AsyncStorage.getItem(key);
    if (allNotes !== null) {
      return JSON.parse(allNotes);
    }
  } catch (error) {
    console.log(error);
  }
}

export const saveData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

export const storeData = async (id, data, key) => {
  var all = await fetchData(key);
  //console.log(allNotes);
  if (all) {
    const existing = all.filter(item => item.id === id);

    if (existing.length === 0){
      all.unshift(data);
    } else {
      const existing_index = all.indexOf(existing[0]);
      all[existing_index] = data;
    }
  } else {
    all = [];
    all.unshift(data);
  }

  try {
    await AsyncStorage.setItem(key, JSON.stringify(all));
  } catch (error) {
    console.log(error);
  }
};

export const deleteData = async (id, key) => {
  //console.log('deleting' + id);
  var all = await fetchData(key);

  var remaining = null;

  remaining = key == 'allNotes' || 'allRemiders' ? all.filter(item => item.id !== id) : all.filter(tag => tag.name !== id);
  //console.log(remaining);
  try {
    await AsyncStorage.setItem(key, JSON.stringify(remaining));
  } catch (error) {
    console.log(error);
  }
}

export const deleteAll = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
}