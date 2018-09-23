import React, {Component} from 'react';
import {Keyboard} from '../utils/keyboard-api';
const HID = require('node-hid');
export class Wilba extends Component {
  constructor(props) {
    super();
    this.state = {
      rangeVal: '5',
      layout: [[]]
    };
  }

  onChange(event) {
    const text = event.target.value;
    this.setState({textVal: text});
  }

  onRangeChange(event) {
    const brightness = event.target.value;
    this.setState({rangeVal: brightness});
    this.getKB().setRGBMode(parseInt(brightness));
  }

  getKB() {
    return new Keyboard(this.props.keyboard);
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
        <h2>Keyboard Layout Map</h2>
        <button
          onClick={async () => {
            const layout = await this.getKB().readLayout(5, 15);
            this.setState({layout});
          }}
        >
          Generate
        </button>
        <table>
          <tbody>
            {this.state.layout.map(column => (
              <tr>
                {column.map(row => (
                  <td>{row}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
