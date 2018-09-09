// @flow
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import styles from './Home.css';
import {Key} from './Key';
import {CenterKey} from './CenterKey';
import {parseKLERaw} from '../utils/kle-parser';
import {getKeycodes, isAlpha, isNumericSymbol} from '../utils/key';
import {Wilba} from './Wilba';
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
    return (
      <div className={styles.keyboard}>
        {parseKLERaw().map(arr => (
          <div className={styles.row}>
            {arr.map(key => this.chooseKey(key))}
          </div>
        ))}
      </div>
    );
  }

  chooseKey({label, size}) {
    if (isAlpha(label)) {
      return label && <Key label={label} size={size} />;
    } else if (isNumericSymbol(label)) {
      const topLabel = label[0];
      const bottomLabel = label[label.length - 1];
      return (
        topLabel &&
        bottomLabel && (
          <Key topLabel={topLabel} bottomLabel={bottomLabel} size={size} />
        )
      );
    } else {
      return <CenterKey label={label} size={size} />;
    }
  }

  updateDevices() {
    this.setState({devices: scanDevices()});
  }

  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2>Devices:</h2>
          <Wilba />
          <button onClick={() => this.updateDevices()}>Refresh Devices</button>
          <select>
            {this.state.devices.map(({manufacturer, product, path}) => (
              <option key={path}>
                {product} ({manufacturer})
              </option>
            ))}
          </select>
        </div>

        {this.buildKeyboard()}
        <div>
          {getKeycodes().map(({code, name}) => (
            <div>
              {code}: {name}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
