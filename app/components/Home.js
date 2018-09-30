// @flow
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import styles from './Home.css';
import {Key} from './Key';
import {Keyboard} from './keyboard';
import {KeycodeMenu} from './keycode-menu';
import {getByteForCode, getKeycodes} from '../utils/key';
import {getKeyboardFromDevice, getKeyboards} from '../utils/hid-keyboards';
import {MatrixLayout} from '../utils/layout-parser';
import {KeyboardAPI} from '../utils/keyboard-api';
import {TitleBar, Title} from './title-bar';
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
      selectedTitle: Title.KEYS,
      activeLayer: 0,
      matrixKeycodes: []
    };
  }

  componentDidMount() {
    const updateDevices = timeoutRepeater(() => this.updateDevices(), 500, 10);
    usbDetect.on('change', updateDevices);
    updateDevices();
  }

  componentWillUnmount() {
    usbDetect.off('change');
  }

  clearSelectedKey(evt) {
    this.setState({selectedKey: null});
  }

  setSelectedKey(idx) {
    this.setState({selectedKey: idx});
  }

  setSelectedTitle(selectedTitle) {
    this.setState({selectedTitle});
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

  renderDebug(shouldRender) {
    if (shouldRender) {
      return (
        <div>
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
      );
    }
  }

  getAPI() {
    const {selectedKeyboard} = this.state;
    if (selectedKeyboard) {
      const keyboard = getKeyboardFromDevice(selectedKeyboard);
      return new KeyboardAPI(selectedKeyboard);
    }
  }

  getKeyboard() {
    const {selectedKeyboard} = this.state;
    if (selectedKeyboard) {
      return getKeyboardFromDevice(selectedKeyboard);
    }
  }

  getMatrix() {
    const {selectedKeyboard} = this.state;
    if (selectedKeyboard) {
      const keyboard = getKeyboardFromDevice(selectedKeyboard);
      const matrixLayout = MatrixLayout[keyboard.name];
      return matrixLayout;
    }
  }

  async updateSelectedKey(value) {
    const {activeLayer, selectedKey} = this.state;
    const api = this.getAPI();
    const matrixLayout = this.getMatrix();

    if (api && selectedKey) {
      const {row, col} = matrixLayout[parseInt(selectedKey)];
      const key = await api.setKey(activeLayer, row, col, value);
      const matrixKeycodes = await api.readMatrix(matrixLayout, activeLayer);
      this.setState({matrixKeycodes});
    }
  }

  async updateFullMatrix() {
    const api = this.getAPI();
    const matrixLayout = this.getMatrix();
    if (api && matrixLayout) {
      const matrixKeycodes = await api.readMatrix(
        matrixLayout,
        this.state.activeLayer
      );
      console.log(matrixKeycodes);
      this.setState({matrixKeycodes});
    }
  }

  renderMenu(selectedTitle) {
    if (selectedTitle === Title.KEYS) {
      return (
        <KeycodeMenu updateSelectedKey={this.updateSelectedKey.bind(this)} />
      );
    } else if (selectedTitle === 'LIGHTING') {
      return <div />;
    }
  }

  render() {
    const {
      activeLayer,
      selectedKey,
      matrixKeycodes,
      selectedKeyboard,
      selectedTitle
    } = this.state;
    return (
      <div className={styles.home}>
        <TitleBar
          selectedTitle={selectedTitle}
          getKeyboard={this.getKeyboard.bind(this)}
          setSelectedTitle={this.setSelectedTitle.bind(this)}
        />
        <Keyboard
          activeLayer={activeLayer}
          selectedKey={selectedKey}
          selectedKeyboard={selectedKeyboard}
          selectedTitle={selectedTitle}
          matrixKeycodes={matrixKeycodes}
          clearSelectedKey={this.clearSelectedKey.bind(this)}
          setSelectedKey={this.setSelectedKey.bind(this)}
          updateFullMatrix={this.updateFullMatrix.bind(this)}
          updateLayer={activeLayer => this.setState({activeLayer})}
        />
        <div className={styles.container} data-tid="container">
          {this.renderDebug(false)}
          {this.renderMenu(selectedTitle)}
        </div>
      </div>
    );
  }
}
