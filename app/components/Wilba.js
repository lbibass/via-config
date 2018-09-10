import React, {Component} from 'react';
const HID = require('node-hid');
export class Wilba extends Component {
  constructor(props) {
    super();
    this.state = {
      textVal: 'Here is a textarea for you :)',
      rangeVal: '5'
    };
  }

  onChange(event) {
    const text = event.target.value;
    this.setState({textVal: text});
  }

  onRangeChange(event) {
    const text = event.target.value;
    this.setState({rangeVal: text});
  }
  onClick() {
    const kb = new HID.HID(this.props.keyboard);
    const magicNumbers = [0x00, 0x07, 0xa];
    const brightness = parseInt(this.state.rangeVal);
    const bytes = [...magicNumbers, brightness];
    kb.write(bytes);
  }

  render() {
    return (
      <div>
        <input
          type="range"
          value={this.state.rangeVal}
          onChange={this.onRangeChange.bind(this)}
          min="0"
          max="10"
        />
        <button onClick={this.onClick.bind(this)}>Change Lights</button>
      </div>
    );
  }
}
