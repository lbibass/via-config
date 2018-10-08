// @flow
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import styles from './Home.css';
import {Key} from './Key';
import {Keyboard} from './keyboard';
import {KeycodeMenu} from './keycode-menu';
import {mapEvtToKeycode, getByteForCode, getKeycodes} from '../utils/key';
import {getKeyboardFromDevice, getKeyboards} from '../utils/hid-keyboards';
import {MatrixLayout} from '../utils/layout-parser';
import {KeyboardAPI} from '../utils/keyboard-api';
import {TitleBar, Title} from './title-bar';
import {Wilba} from './Wilba';
import {LightingMenu} from './lighting-menu';
const usbDetect = require('usb-detection');
usbDetect.startMonitoring();
type Props = {};

const timeoutPromise = ms => new Promise(res => setTimeout(res, ms));
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
    this.handleKeys = this.handleKeys.bind(this);
    const keyboards = getKeyboards();
    const firstKeyboard = keyboards[0] || null;
    if (firstKeyboard) {
      this.state = {
        keyboards,
        detected: false,
        selectedKeyboard: firstKeyboard,
        selectedKey: null,
        selectedTitle: Title.KEYS,
        activeLayer: 0,
        matrixKeycodes: {
          [firstKeyboard.path]: [[], [], [], []]
        }
      };
    } else {
      this.state = {
        keyboards,
        detected: false,
        selectedKeyboard: null,
        selectedKey: null,
        selectedTitle: null,
        activeLayer: null,
        matrixKeycodes: {}
      };
    }
  }

  componentDidMount() {
    const updateDevices = timeoutRepeater(() => this.updateDevices(), 500, 5);
    usbDetect.on('change', updateDevices);
    updateDevices();
    document.body.addEventListener('keydown', this.handleKeys);
  }

  componentWillUnmount() {
    usbDetect.off('change');
    document.body.removeEventListener('keydown', this.handleKeys);
  }

  async checkIfDetected(selectedKeyboard) {
    this.setState({detected: false});
    if (selectedKeyboard && selectedKeyboard.path) {
      const res = await this.getAPI(selectedKeyboard).getProtocolVersion();
      if (res === 7) {
        this.setState({detected: true});
      }
    }
  }

  handleKeys(evt) {
    if (this.state.selectedKey) {
      this.updateSelectedKey(getByteForCode(mapEvtToKeycode(evt)));
    }
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

  async updateDevices() {
    const keyboards = getKeyboards();
    const oldSelectedKeyboard = this.state.selectedKeyboard;
    const oldSelectedPath = oldSelectedKeyboard && oldSelectedKeyboard.path;
    const selectedKeyboard =
      keyboards.find(keyboard => keyboard.path === oldSelectedPath) ||
      keyboards[0];
    const selectedKeyboardPath = selectedKeyboard && selectedKeyboard.path;
    if (oldSelectedPath !== selectedKeyboardPath) {
      if (selectedKeyboardPath !== undefined) {
        this.setState({
          keyboards,
          selectedKeyboard,
          selectedKey: null,
          activeLayer: 0,
          matrixKeycodes: {
            ...this.state.matrixKeycodes,
            [selectedKeyboardPath]: [[], [], [], []]
          },
          selectedTitle: Title.KEYS
        });
        await this.checkIfDetected(selectedKeyboard);
        await this.updateFullMatrix(0, selectedKeyboard);
      } else {
        this.setState({
          keyboards,
          selectedKeyboard: undefined,
          selectedKey: null,
          activeLayer: 0,
          selectedTitle: null
        });
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

  setKeyInMatrix(
    key,
    numSelectedKey,
    activeLayer,
    selectedKeyboard,
    matrixKeycodes
  ) {
    const matrixLayerKeycodes = matrixKeycodes[selectedKeyboard.path];
    const layerKeycodes = matrixLayerKeycodes[activeLayer];
    const newLayerKeycodes = layerKeycodes
      .slice(0, numSelectedKey)
      .concat(key)
      .concat(layerKeycodes.slice(numSelectedKey + 1));
    const newDeviceMatrixKeycodes = matrixLayerKeycodes
      .slice(0, activeLayer)
      .concat([newLayerKeycodes])
      .concat(matrixLayerKeycodes.slice(activeLayer + 1));

    this.setState({
      matrixKeycodes: {
        ...matrixKeycodes,
        [selectedKeyboard.path]: newDeviceMatrixKeycodes
      }
    });
  }

  async updateSelectedKey(value) {
    const {
      activeLayer,
      selectedKeyboard,
      selectedKey,
      matrixKeycodes
    } = this.state;
    const api = this.getAPI(selectedKeyboard);
    const matrixLayout = this.getMatrix(selectedKeyboard);
    const numSelectedKey = parseInt(selectedKey);

    if (api && selectedKey && selectedKeyboard) {
      const {row, col} = matrixLayout[numSelectedKey];
      //Optimistically set
      this.setKeyInMatrix(
        value,
        numSelectedKey,
        activeLayer,
        selectedKeyboard,
        matrixKeycodes
      );
      const key = await api.setKey(activeLayer, row, col, value);
      if (key !== value) {
        this.setKeyInMatrix(
          key,
          numSelectedKey,
          activeLayer,
          selectedKeyboard,
          matrixKeycodes
        );
      }
    }
  }

  async setRGBMode(value) {
    const {selectedKeyboard} = this.state;
    const api = this.getAPI(selectedKeyboard);
    if (api) {
      await api.setRGBMode(value);
    }
  }

  async toggleLights(selectedKeyboard) {
    const api = this.getAPI(selectedKeyboard);
    if (api) {
      const [, , val] = await api.getRGBMode();
      const newVal = val === 9 ? 0 : 9;
      await api.setRGBMode(newVal);
      await timeoutPromise(200);
      await api.setRGBMode(val);
      await timeoutPromise(200);
      await api.setRGBMode(newVal);
      await timeoutPromise(200);
      await api.setRGBMode(val);
    }
  }

  async updateFullMatrix(activeLayer, selectedKeyboard) {
    const api = this.getAPI(selectedKeyboard);
    const matrixLayout = this.getMatrix(selectedKeyboard);
    if (api && matrixLayout) {
      const layerMatrixKeycodes = await api.readMatrix(
        matrixLayout,
        activeLayer
      );
      const matrixKeycodes = this.state.matrixKeycodes;
      const deviceMatrixKeycodes = matrixKeycodes[selectedKeyboard.path] || [
        [],
        [],
        [],
        []
      ];
      const newDeviceMatrixKeycodes = deviceMatrixKeycodes
        .slice(0, activeLayer)
        .concat([layerMatrixKeycodes])
        .concat(deviceMatrixKeycodes.slice(activeLayer + 1));
      this.setState({
        matrixKeycodes: {
          ...matrixKeycodes,
          [selectedKeyboard.path]: newDeviceMatrixKeycodes
        }
      });
    }
  }

  renderMenu(selectedTitle) {
    if (selectedTitle === Title.KEYS) {
      return (
        <KeycodeMenu updateSelectedKey={this.updateSelectedKey.bind(this)} />
      );
    } else if (selectedTitle === Title.LIGHTING) {
      return <LightingMenu setRGBMode={this.setRGBMode.bind(this)} />;
    }
  }

  async offsetKeyboard(offset) {
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
        activeLayer: 0
      });
      await this.checkIfDetected(selectedKeyboard);
      await this.updateFullMatrix(0, selectedKeyboard);
      await this.toggleLights(selectedKeyboard);
    }
  }

  getLayerMatrix(selectedKeyboard, selectedLayer) {
    if (selectedKeyboard) {
      const deviceMatrixKeycodes = this.state.matrixKeycodes[
        selectedKeyboard.path
      ] || [[], [], [], []];
      return deviceMatrixKeycodes[selectedLayer];
    }
  }

  updateLayer(activeLayer) {
    this.setState({activeLayer});
    this.updateFullMatrix(activeLayer, this.state.selectedKeyboard);
  }

  render() {
    const {
      activeLayer,
      detected,
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
          detected={detected}
          selectedKey={selectedKey}
          selectedKeyboard={selectedKeyboard}
          selectedTitle={selectedTitle}
          checkIfDetected={this.checkIfDetected.bind(this)}
          matrixKeycodes={this.getLayerMatrix(selectedKeyboard, activeLayer)}
          clearSelectedKey={this.clearSelectedKey.bind(this)}
          setSelectedKey={this.setSelectedKey.bind(this)}
          updateFullMatrix={this.updateFullMatrix.bind(this)}
          updateLayer={this.updateLayer.bind(this)}
          showCarouselButtons={this.state.keyboards.length > 1}
          prevKeyboard={() => this.offsetKeyboard(-1)}
          nextKeyboard={() => this.offsetKeyboard(1)}
        />
        <div className={styles.container} data-tid="container">
          <div class={styles.menuContainer}>
            {this.renderDebug(false)}
            {this.renderMenu(selectedTitle)}
          </div>
        </div>
      </div>
    );
  }
}
