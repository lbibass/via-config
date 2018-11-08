// @flow
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import styles from './Home.css';
import {Key} from './Key';
import {Keyboard} from './keyboard';
import {DebugMenu, KeycodeMenu, LightingMenu} from './menus';
import {mapEvtToKeycode, getByteForCode, getKeycodes} from '../utils/key';
import {getKeyboardFromDevice, getKeyboards} from '../utils/hid-keyboards';
import {MatrixLayout} from '../utils/layout-parser';
import {KeyboardAPI} from '../utils/keyboard-api';
import {TitleBar, Title} from './title-bar';
import {Wilba} from './Wilba';
import {LoadingScreen} from './loading-screen';
const usbDetect = require('usb-detection');
const debounce = require('lodash.debounce');
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
    this.state = {
      keyboards,
      connected: false,
      detected: false,
      selectedKeyboard: null,
      selectedKey: null,
      selectedTitle: null,
      activeLayer: null,
      matrixKeycodes: {}
    };
    this.saveLighting = debounce(this.saveLighting.bind(this), 500);
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

  saveLighting(api) {
    console.log('saving', +new Date());
    if (api) return api.saveLighting();
  }

  async checkIfDetected(selectedKeyboard) {
    this.setState({connected: false});
    if (selectedKeyboard && selectedKeyboard.path) {
      const res = await this.getAPI(selectedKeyboard).getProtocolVersion();
      if ([1, 7].includes(res)) {
        this.setState({connected: true});
      }
    }
  }

  async getCurrentLightingSettings(selectedKeyboard) {
    const api = this.getAPI(selectedKeyboard);
    if (api) {
      const promises = [
        api.getRGBMode(),
        api.getBrightness(),
        api.getColor(1),
        api.getColor(2)
      ];
      const [rgbMode, brightness, color1, color2] = await Promise.all(promises);
      const lightingData = {
        rgbMode,
        brightness,
        color1,
        color2
      };
      this.setState({lightingData});
    }
  }

  handleKeys(evt) {
    if (this.state.selectedKey !== null) {
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
          connected: false,
          detected: true,
          activeLayer: 0,
          matrixKeycodes: {
            ...this.state.matrixKeycodes,
            [selectedKeyboardPath]: [[], [], [], []]
          },
          selectedTitle: Title.KEYS
        });
        await this.checkIfDetected(selectedKeyboard);
        await this.updateFullMatrix(0, selectedKeyboard);
        await this.updateFullMatrix(1, selectedKeyboard);
        await this.updateFullMatrix(2, selectedKeyboard);
        await this.updateFullMatrix(3, selectedKeyboard);
        await this.getCurrentLightingSettings(selectedKeyboard);
        this.setReady();
      } else {
        this.setState({
          keyboards,
          selectedKeyboard: undefined,
          detected: false,
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
    const numSelectedKey = selectedKey;

    if (api && selectedKey != null && selectedKeyboard) {
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
      this.keyboard.overlay.animateSuccess();
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

  async setBrightness(value) {
    const {selectedKeyboard} = this.state;
    const api = this.getAPI(selectedKeyboard);
    if (api) {
      await api.setBrightness(value);
    }
  }
  async setColor(hue, sat) {
    const {selectedKeyboard} = this.state;
    const api = this.getAPI(selectedKeyboard);
    if (api) {
      await api.setColor(hue, sat);
    }
  }
  async setRGBMode(value) {
    const {selectedKeyboard} = this.state;
    const api = this.getAPI(selectedKeyboard);
    if (api) {
      await api.setRGBMode(value);
    }
  }

  setReady() {
    this.setState({ready: true});
  }

  async toggleLights(selectedKeyboard) {
    const api = this.getAPI(selectedKeyboard);
    const keyboard = getKeyboardFromDevice(selectedKeyboard);
    if (api && keyboard.lights) {
      const val = await api.getRGBMode();
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

  renderMenu(selectedTitle, selectedKeyboard) {
    if (selectedTitle === Title.KEYS) {
      return (
        <KeycodeMenu updateSelectedKey={this.updateSelectedKey.bind(this)} />
      );
    } else if (selectedTitle === Title.LIGHTING) {
      const api = this.getAPI(selectedKeyboard);
      return (
        <LightingMenu
          api={api}
          lightingData={this.state.lightingData}
          updateColor={this.updateColor.bind(this, api)}
          updateRGBMode={this.updateRGBMode.bind(this, api)}
          saveLighting={() => this.saveLighting(api)}
          setRGBMode={this.setRGBMode.bind(this)}
        />
      );
    } else if (selectedTitle === Title.DEBUG) {
      return <DebugMenu api={this.getAPI(selectedKeyboard)} />;
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
        selectedTitle: Title.KEYS,
        detected: true,
        connected: false,
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

  updateBrightness(api, brightness) {
    const {lightingData} = this.state;
    this.setState({
      lightingData: {
        ...lightingData,
        brightness
      }
    });
    api.setBrightness(brightness);
    this.saveLighting(api);
  }

  updateColor(api, num, hue, sat) {
    const {lightingData} = this.state;
    if (num === 1) {
      this.setState({
        lightingData: {
          ...lightingData,
          color1: {hue, sat}
        }
      });
    } else if (num === 2) {
      this.setState({
        lightingData: {
          ...lightingData,
          color2: {hue, sat}
        }
      });
    }
    api.setColor(num, hue, sat);
    this.saveLighting(api);
  }

  updateRGBMode(api, rgbMode) {
    const {lightingData} = this.state;
    this.setState({
      lightingData: {
        ...lightingData,
        rgbMode
      }
    });
    api.setRGBMode(rgbMode);
    this.saveLighting(api);
  }

  render() {
    const {
      activeLayer,
      connected,
      detected,
      lightingData,
      selectedKey,
      matrixKeycodes,
      selectedKeyboard,
      selectedTitle
    } = this.state;
    return (
      <div className={styles.home}>
        <LoadingScreen ready={this.state.ready} />
        {this.state.ready && (
          <React.Fragment>
            <TitleBar
              key="title-bar"
              selectedTitle={selectedTitle}
              getKeyboard={this.getKeyboard.bind(this)}
              setSelectedTitle={this.setSelectedTitle.bind(this)}
            />
            <Keyboard
              activeLayer={activeLayer}
              ref={keyboard => (this.keyboard = keyboard)}
              connected={connected}
              detected={detected}
              selectedKey={selectedKey}
              selectedKeyboard={selectedKeyboard}
              selectedTitle={selectedTitle}
              checkIfDetected={this.checkIfDetected.bind(this)}
              matrixKeycodes={this.getLayerMatrix(
                selectedKeyboard,
                activeLayer
              )}
              lightingData={lightingData}
              clearSelectedKey={this.clearSelectedKey.bind(this)}
              setSelectedKey={this.setSelectedKey.bind(this)}
              setReady={this.setReady.bind(this)}
              updateFullMatrix={this.updateFullMatrix.bind(this)}
              updateLayer={this.updateLayer.bind(this)}
              updateBrightness={this.updateBrightness.bind(
                this,
                this.getAPI(selectedKeyboard)
              )}
              showCarouselButtons={this.state.keyboards.length > 1}
              prevKeyboard={() => this.offsetKeyboard(-1)}
              nextKeyboard={() => this.offsetKeyboard(1)}
            />
            <div className={styles.container} data-tid="container">
              <div className={styles.menuContainer}>
                {this.renderDebug(false)}
                {this.renderMenu(selectedTitle, selectedKeyboard)}
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}
