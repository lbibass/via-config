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
      selectedKeyboard: firstKeyboard || null,
      selectedKey: null,
      selectedTitle: firstKeyboard && Title.KEYS,
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
    const oldSelectedPath = oldSelectedKeyboard && oldSelectedKeyboard.path;
    const selectedKeyboard =
      keyboards.find(keyboard => keyboard.path === oldSelectedPath) ||
      keyboards[0];
    const selectedKeyboardPath = selectedKeyboard && selectedKeyboard.path;
    if (oldSelectedPath !== selectedKeyboardPath) {
      if (selectedKeyboardPath === undefined) {
        this.setState({
          keyboards,
          selectedKeyboard: undefined,
          selectedKey: null,
          activeLayer: 0,
          selectedTitle: null
        });
      } else {
        this.setState({
          keyboards,
          selectedKeyboard,
          selectedKey: null,
          activeLayer: 0,
          matrixKeycodes: [],
          selectedTitle: Title.KEYS
        });
        this.updateFullMatrix(0, selectedKeyboard);
      }
    } else {
      this.setState({keyboards});
    }
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

  getAPI(selectedKeyboard) {
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

  getMatrix(selectedKeyboard) {
    if (selectedKeyboard) {
      const keyboard = getKeyboardFromDevice(selectedKeyboard);
      const matrixLayout = MatrixLayout[keyboard.name];
      return matrixLayout;
    }
  }

  async updateSelectedKey(value) {
    const {activeLayer, selectedKeyboard, selectedKey} = this.state;
    const api = this.getAPI(selectedKeyboard);
    const matrixLayout = this.getMatrix(selectedKeyboard);

    if (api && selectedKey) {
      const {row, col} = matrixLayout[parseInt(selectedKey)];
      const key = await api.setKey(activeLayer, row, col, value);
      const matrixKeycodes = await api.readMatrix(matrixLayout, activeLayer);
      this.setState({matrixKeycodes});
    }
  }

  async updateFullMatrix(activeLayer, selectedKeyboard) {
    const layer = activeLayer;
    const api = this.getAPI(selectedKeyboard);
    const matrixLayout = this.getMatrix(selectedKeyboard);
    if (api && matrixLayout) {
      const matrixKeycodes = await api.readMatrix(matrixLayout, layer);
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

  offsetKeyboard(offset) {
    const keyboards = this.state.keyboards;
    const selectedPath =
      this.state.selectedKeyboard && this.state.selectedKeyboard.path;
    const length = keyboards.length;
    if (length > 1) {
      const idx = keyboards.indexOf(
        keyboards.find(({path}) => path === selectedPath)
      );
      const selectedKeyboard = keyboards[(idx + offset + length) % length];
      this.setState({
        selectedKeyboard,
        selectedKey: null,
        activeLayer: 0,
        matrixKeycodes: []
      });
      this.updateFullMatrix(0, selectedKeyboard);
    }
  }

  updateLayer(activeLayer) {
    this.setState({activeLayer});
    this.updateFullMatrix(activeLayer, this.state.selectedKeyboard);
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
          updateLayer={this.updateLayer.bind(this)}
          showCarouselButtons={this.state.keyboards.length > 1}
          prevKeyboard={() => this.offsetKeyboard(-1)}
          nextKeyboard={() => this.offsetKeyboard(1)}
        />
        <div className={styles.container} data-tid="container">
          {this.renderDebug(false)}
          {this.renderMenu(selectedTitle)}
        </div>
      </div>
    );
  }
}
