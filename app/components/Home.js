// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import Key from './Key';
const HID = require('node-hid');

type Props = {};

function scanDevices() {
  const devices = HID.devices();
  console.log(devices);
  return devices;
}

export default class Home extends Component<Props, {}> {
  props: Props;

  constructor() {
    super();
    this.state = {devices: scanDevices()};
  }

  buildKeyboard() {
    const keys = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
    return <div className="keyboard">{keys.map(label => <Key label={label} />)}</div>;
  }

  updateDevices() {
    this.setState({devices: scanDevices()});
  }

  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2>Devices:</h2>
          <button onClick={() => this.updateDevices()}>Refresh Devices</button>
          <select>{this.state.devices.map(({manufacturer, product, path}) =>
            <option key={path}>{product} ({manufacturer})</option>)}
          </select>
        </div>

        {this.buildKeyboard()}
      </div>
    );
  }
}
