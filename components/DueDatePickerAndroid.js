import React, {Component} from 'react';
import {DatePickerAndroid, TimePickerAndroid, TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default class DueDatePickerAndroid extends Component {

  constructor(props) {
    super(props);
    const {dueDate} = this.props;

    const now = new Date();

    this.state = {
      years: dueDate ? dueDate.getFullYear() : now.getFullYear(),
      months: dueDate ? dueDate.getMonth() : now.getMonth(),
      days: dueDate ? dueDate.getDate() : now.getDate(),
      hours: dueDate ? dueDate.getHours() : now.getHours(),
      minutes: dueDate ? dueDate.getMinutes() : now.getMinutes(),    
      //chosenDate: dueDate ? dueDate : new Date(),
    };
  }

  componentDidMount(){
    const {setDueDate} = this.props;
    const {years, months, days, hours, minutes} = this.state;

    const newDate = new Date(years, months, days, hours, minutes);
    setDueDate(newDate);
  }

  componentDidUpdate(prevProps, prevState){
    if (prevState !== this.state){
      const {setDueDate} = this.props;
      const {years, months, days, hours, minutes} = this.state;

      const newDate = new Date(years, months, days, hours, minutes);
      setDueDate(newDate);
    }
  }
  
  openDatePicker = async () => {
    const {years, months, days} = this.state;
    const currentDate = new Date(years, months, days);
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: currentDate,
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        this.setState({years: year, months: month, days: day});
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }

  openTimePicker = async () => {
    const {hours, minutes} = this.state;

    try {
      const {action, hour, minute} = await TimePickerAndroid.open({
        hour: hours,
        minute: minutes,
        is24Hour: true,
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        this.setState({hours: hour, minutes: minute});
      }
    } catch ({code, message}) {
      console.warn('Cannot open time picker', message);
    }
  }

  render() {
    const {years, months, days, hours, minutes} = this.state;

    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <AntDesign 
            name='calendar' 
            size={20} 
            color='grey'
          />
          <TouchableOpacity
            onPress={this.openDatePicker}
            style={styles.timeInput}
          >
            <Text>{days + '/' + (months+1) + '/' + years}</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row'}}>
          <AntDesign 
            name='clockcircleo' 
            size={20} 
            color='grey'
          />
          <TouchableOpacity
            onPress={this.openTimePicker}
            style={styles.timeInput}
          >
            <Text style={styles.timeText}>{hours + ':' + minutes}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInput: {
    marginLeft: 5,
    padding: 2, 
    borderBottomColor: 'lightgrey', 
    borderBottomWidth: 0.5
  },
  timeText: {
    fontSize: 14,
  }
})