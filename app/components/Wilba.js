import React, {Component} from 'react';
const HID = require('node-hid');
export class Wilba extends Component {
  constructor(props) {
    super();
    this.state = {
      rangeVal: '5'
    };
  }

  onChange(event) {
    const text = event.target.value;
    this.setState({textVal: text});
  }

  onRangeChange(event) {
    const brightness = event.target.value;
    this.setState({rangeVal: brightness});
    this.setRGBMode(parseInt(brightness));
  }

  getKB() {
    return new HID.HID(this.props.keyboard);
  }

  setRGBMode(brightness = 0) {
    const magicNumbers = [0x00, 0x07, 0xa];
    const bytes = [...magicNumbers, brightness];
    this.writeKB(bytes);
  }

  writeKB(bytes) {
    this.getKB().write(bytes);
  }

  onClick() {}

  render() {
    return (
      <div>
        <h2>Change Lights</h2>
        <input
          type="range"
          value={this.state.rangeVal}
          onChange={this.onRangeChange.bind(this)}
          min="0"
          max="10"
        />
      </div>
    );
  }
}
