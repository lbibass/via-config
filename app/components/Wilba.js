import React, {Component} from 'react';
import {Keyboard} from '../utils/keyboard-api';
import {byteToKey} from '../utils/key';

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

  async refreshLayout() {
    const layout = await this.getKB().readLayout(5, 15);
    this.setState({layout});
  }

  getKB() {
    const {keyboard = {}} = this.props;
    return new Keyboard(keyboard.path);
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
        <button onClick={this.refreshLayout.bind(this)}>Generate</button>
        <table>
          <tbody>
            {this.state.layout.map(column => (
              <tr>
                {column.map(row => (
                  <td>
                    {row}: {byteToKey[row]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Set Keyboard Layout Map</h2>
        Layer:
        <input
          type="text"
          value={this.state.layer}
          onChange={evt => this.setState({layer: evt.target.value})}
        />
        Row:
        <input
          type="text"
          value={this.state.row}
          onChange={evt => this.setState({row: evt.target.value})}
        />
        Column:
        <input
          type="text"
          value={this.state.column}
          onChange={evt => this.setState({column: evt.target.value})}
        />
        Value:
        <input
          type="text"
          value={this.state.key}
          onChange={evt => this.setState({key: evt.target.value})}
        />
        <button
          onClick={async () => {
            await this.getKB().setKey(
              this.state.layer,
              this.state.row,
              this.state.column,
              this.state.key
            );
            this.refreshLayout();
          }}
        >
          Update Key
        </button>
      </div>
    );
  }
}
