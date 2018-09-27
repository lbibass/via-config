// @flow
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import styles from './Home.css';
import {Key} from './Key';
import {Keyboard} from './keyboard';
import {getByteForCode, getKeycodes} from '../utils/key';
import {getKeyboards} from '../utils/hid-keyboards';
import {Wilba} from './Wilba';
const usbDetect = require('usb-detection');
usbDetect.startMonitoring();
type Props = {};

const OVERRIDE_DETECT = true;
const timeoutRepeater = (fn, timeout, numToRepeat = 0) => () =>
  setTimeout(() => {
    fn();
    if (numToRepeat > 0) {
      timeoutRepeater(fn, timeout, numToRepeat - 1)();
    }
  }, timeout);

export default class Home extends Component<Props, {}> {
  props: Props;

  constructor() {
    super();
    const keyboards = getKeyboards();
    const firstKeyboard = keyboards[0];

    this.state = {
      keyboards,
      selectedKeyboard: firstKeyboard,
      selectedKey: null,
      activeLayer: 0
    };
  }

  clearSelectedKey(evt) {
    this.setState({selectedKey: null});
  }

  setSelectedKey(idx) {
    this.setState({selectedKey: idx});
  }

  componentDidMount() {
    const updateDevices = timeoutRepeater(() => this.updateDevices(), 500, 10);
    usbDetect.on('change', updateDevices);
    updateDevices();
  }

  componentWillUnmount() {
    usbDetect.off('change');
  }

  updateDevices() {
    const keyboards = getKeyboards();
    const oldSelectedKeyboard = this.state.selectedKeyboard;
    const selectedKeyboardObj =
      keyboards.find(
        keyboard =>
          keyboard.path === (oldSelectedKeyboard && oldSelectedKeyboard.path)
      ) || keyboards[0];
    const selectedKeyboard = selectedKeyboardObj;
    this.setState({keyboards, selectedKeyboard});
  }

  setDeviceFromPath(path) {
    if (path) {
      const keyboards = getKeyboards();
      this.setState({selectedKeyboard: keyboards.find(kb => path === kb.path)});
    }
  }

  renderDevicesDropdown(devices) {
    const selectedPath =
      this.state.selectedKeyboard && this.state.selectedKeyboard.path;
    return (
      <select
        value={selectedPath}
        onChange={evt => this.setDeviceFromPath(evt.target.value)}
      >
        {devices.map(({manufacturer, product, path}) => (
          <option value={path} key={path}>
            {path} {product} ({manufacturer})
          </option>
        ))}
      </select>
    );
  }

  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <Keyboard
            activeLayer={this.state.activeLayer}
            selectedKey={this.state.selectedKey}
            selectedKeyboard={this.state.selectedKeyboard}
            clearSelectedKey={this.clearSelectedKey.bind(this)}
            setSelectedKey={this.setSelectedKey.bind(this)}
            updateLayer={activeLayer => this.setState({activeLayer})}
          />
          <h2>Devices:</h2>
          <button onClick={() => this.updateDevices()}>Refresh Devices</button>
          {this.renderDevicesDropdown(this.state.keyboards)}
          {this.state.selectedKeyboard && (
            <Wilba
              activeLayer={this.state.activeLayer}
              keyboard={this.state.selectedKeyboard}
            />
          )}
        </div>

        <h2>Keycodes:</h2>
        <div>
          {getKeycodes().map(({code, name}) => (
            <div>
              {code}: {name} : {getByteForCode(code)}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
