// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
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

  updateDevices() {
    this.setState({devices: scanDevices()});
  }

  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2>Devices:</h2>
          <button onClick={() => this.updateDevices()}>Update Devices</button>
          <select>{this.state.devices.map(({product}) => <option>{product}</option>)}</select>
        </div>
      </div>
    );
  }
}
