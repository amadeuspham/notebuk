import React, {Component} from 'react';
import {DatePickerIOS} from 'react-native';

export default class DueDatePickerIOS extends Component {

  constructor(props) {
    super(props);
    const {dueDate} = this.props;

    this.state = {
      chosenDate: dueDate ? dueDate : new Date(),
    };
  }
  

  setDate = (newDate) => {
    const {setDueDate} = this.props;
    //console.log(this.state.chosenDate);
    this.setState({chosenDate: newDate}, setDueDate(newDate));
  }

  render() {
    return (
      <DatePickerIOS
        date={this.state.chosenDate}
        onDateChange={this.setDate}
      />
    );
  }
}