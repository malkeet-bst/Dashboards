import React from "react";
import { DatePicker } from 'antd';
import moment from "moment";

class CustomPicker extends React.Component {
  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
  };

  componentDidMount=()=>{
    let {defaultStartTime,defaultEndTime}=this.props
    if(defaultStartTime){
      this.setState({startValue:defaultStartTime})
    }
    if(defaultEndTime){
      this.setState({endValue:defaultEndTime})
    }
  }
  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    
    return startValue.valueOf() > endValue.valueOf() ;
  }

  disabledEndDate = (endValue) => {
    
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    console.log(endValue.valueOf,moment().valueOf())
    return endValue.valueOf() <= startValue.valueOf() || endValue.valueOf()<moment().subtract(1, 'days').valueOf();
  }

  onChange = (field, value, valueString) => {
    
    this.setState({
      [field]: value,
    });
    this.props.onChange(field, value, valueString);
  }

  onStartChange = (value,valueString) => {
    
    this.onChange('startValue', value, valueString);
  }

  onEndChange = (value, valueString) => {
    this.onChange('endValue', value, valueString);
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  }

  render() {
    const { startValue, endValue, endOpen } = this.state;
    const dateFormat = 'YYYY-MM-DD';
    return (
      <div>
        <DatePicker
          disabledDate={this.disabledStartDate}
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          value={startValue}
          placeholder="Start"
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
        />
        <DatePicker
          disabledDate={this.disabledEndDate}
          showTime
          defaultValue={moment('2015-06-06', dateFormat)}
          disabled={!startValue}
          format="YYYY-MM-DD HH:mm:ss"
          value={endValue}
          placeholder="End"
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
        />
      </div>
    );
  }
}

export default CustomPicker;