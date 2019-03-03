// @flow
import * as React from 'react';
import {Link} from 'react-router-dom';
import styles from './Home.css';
import {Key} from './Key';
import {Keyboard} from './keyboard';
import {DebugMenu, KeycodeMenu, LightingMenu} from './menus';
import {mapEvtToKeycode, getByteForCode, getKeycodes} from '../utils/key';
import {getKeyboards} from '../utils/hid-keyboards';
import {
  getKeyboardFromDevice,
  getMatrixLayoutFromDevice
} from '../utils/device-meta';
import type {Device} from '../utils/device-meta';
import {MatrixLayout} from '../utils/layout-parser';
import {
  BACKLIGHT_PROTOCOL_NONE,
  BACKLIGHT_PROTOCOL_WILBA,
  KeyboardAPI
} from '../utils/keyboard-api';
import {TitleBar, Title} from './title-bar';
import {LoadingScreen} from './loading-screen';
const usbDetect = require('usb-detection');
const debounce = require('lodash.debounce');
usbDetect.startMonitoring();
type HIDColor = {
  hue: number,
  sat: number
};

export type LightingData = {
  rgbMode: number,
  brightness: number,
  color1: HIDColor,
  color2: HIDColor
};
export type MatrixKeycodes = {[path: string]: number[][]};
type Props = {};
type State = {
  keyboards: Device[],
  connected: boolean,
  loaded: boolean,
  detected: boolean,
  ready: boolean,
  selectedKeyboard: Device | null,
  selectedKey: number | null,
  selectedTitle: string | null,
  activeLayer: number | null,
  matrixKeycodes: MatrixKeycodes,
  backlightVersion?: number,
  lightingData: LightingData | null,
  progress: number
};

const timeoutPromise = ms => new Promise(res => setTimeout(res, ms));
const timeoutRepeater = (fn, timeout, numToRepeat = 0) => () =>
  setTimeout(() => {
    fn();
    if (numToRepeat > 0) {
      timeoutRepeater(fn, timeout, numToRepeat - 1)();
    }
  }, timeout);

export default class Home extends React.Component<Props, State> {
  keyboard: Keyboard | null;
  updateDevicesRepeat: Function;

  constructor() {
    super();
    this.state = {
      keyboards: [],
      connected: false,
      loaded: false,
      detected: false,
      ready: false,
      lightingData: null,
      selectedKeyboard: null,
      selectedKey: null,
      selectedTitle: null,
      activeLayer: null,
      matrixKeycodes: {},
      progress: 0
    };
    (this: any).saveLighting = debounce(this.saveLighting.bind(this), 500);
    (this: any).updateDevicesRepeat = timeoutRepeater(
      () => this.updateDevices(),
      500,
      1
    );
  }

  componentDidMount() {
    usbDetect.on('change', this.updateDevicesRepeat);
    this.updateDevicesRepeat();
    const body = document.body;
    if (body) {
      body.addEventListener('keydown', this.handleKeys);
    }
  }

  componentWillUnmount() {
    usbDetect.off('change', this.updateDevicesRepeat);
    const body = document.body;
    if (body) {
      body.removeEventListener('keydown', this.handleKeys);
    }
  }

  saveLighting(api: KeyboardAPI) {
    console.log('saving', +new Date());
    if (api) return api.saveLighting();
  }

  async isCorrectProtocol(selectedKeyboard: Device): Promise<boolean> {
    const validProtocolVersions = [1, 7, 8, 9];
    this.setState({connected: false});
    const api = this.getAPI(selectedKeyboard);
    if (api) {
      const res = await api.getProtocolVersion();
      if (validProtocolVersions.includes(res)) {
        this.setState({connected: true});
        return true;
      }
    }
    return false;
  }

  async getCurrentLightingSettings(selectedKeyboard: Device) {
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

  handleKeys = (evt: KeyboardEvent): void => {
    if (this.state.selectedKey !== null) {
      this.updateSelectedKey(getByteForCode(mapEvtToKeycode(evt)));
    }
  };

  clearSelectedKey(evt: SyntheticEvent<HTMLDivElement>) {
    this.setState({selectedKey: null});
  }

  setSelectedKey(idx: number) {
    this.setState({selectedKey: idx});
  }

  setSelectedTitle(selectedTitle: string | null) {
    this.setState({selectedKey: null, selectedTitle});
  }

  setProgress(progress: number) {
    this.setState({progress});
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
          loaded: false,
          detected: true,
          activeLayer: 0,
          matrixKeycodes: {
            ...this.state.matrixKeycodes,
            [selectedKeyboardPath]: [[], [], [], []]
          },
          selectedTitle: Title.KEYS
        });
        const protocolCorrect = await this.isCorrectProtocol(selectedKeyboard);
        if (protocolCorrect) {
          await this.updateKeyboardLightingAndMatrixData(selectedKeyboard);
          this.setReady();
          this.setLoaded();
        }
      } else {
        this.setState({
          keyboards,
          selectedKeyboard: null,
          detected: false,
          loaded: false,
          ready: false,
          progress: 0,
          selectedKey: null,
          activeLayer: 0,
          selectedTitle: null
        });
      }
    } else {
      this.setState({keyboards});
    }
  }

  getAPI(selectedKeyboard: Device | null) {
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

  getMatrixLayout(selectedKeyboard: Device | null): * {
    if (selectedKeyboard) {
      const keyboard = getKeyboardFromDevice(selectedKeyboard);
      return getMatrixLayoutFromDevice(selectedKeyboard).layout;
    }
  }

  setKeyInMatrix(
    key: number,
    numSelectedKey: number,
    activeLayer: number,
    selectedKeyboard: Device,
    matrixKeycodes: MatrixKeycodes
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

  async updateSelectedKey(value: number) {
    const {
      activeLayer,
      selectedKeyboard,
      selectedKey,
      matrixKeycodes
    } = this.state;
    const api = this.getAPI(selectedKeyboard);
    const matrixLayout = this.getMatrixLayout(selectedKeyboard);
    const numSelectedKey = selectedKey;

    if (
      api &&
      activeLayer !== null &&
      selectedKey !== null &&
      matrixLayout &&
      selectedKeyboard
    ) {
      const {row, col} = matrixLayout[selectedKey];
      //Optimistically set
      this.setKeyInMatrix(
        value,
        selectedKey,
        activeLayer,
        selectedKeyboard,
        matrixKeycodes
      );
      const key = await api.setKey(activeLayer, row, col, value);
      const animation =
        this.keyboard &&
        this.keyboard.overlay &&
        this.keyboard.overlay.animateSuccess();
      if (animation) {
        animation.onfinish = () =>
          selectedKey === this.state.selectedKey &&
          this.setState({selectedKey: null});
      }
      if (key !== value) {
        this.setKeyInMatrix(
          key,
          selectedKey,
          activeLayer,
          selectedKeyboard,
          matrixKeycodes
        );
      }
    }
  }

  async setBrightness(value: number) {
    const {selectedKeyboard} = this.state;
    const api = this.getAPI(selectedKeyboard);
    if (api) {
      await api.setBrightness(value);
    }
  }

  async setRGBMode(value: number) {
    const {selectedKeyboard} = this.state;
    const api = this.getAPI(selectedKeyboard);
    if (api) {
      await api.setRGBMode(value);
    }
  }

  setLoading() {
    this.setState({loaded: false});
  }

  setLoaded() {
    this.setState({loaded: true});
  }

  setReady() {
    this.setState({progress: 1, ready: true});
  }

  async toggleLights(selectedKeyboard: Device) {
    const api = this.getAPI(selectedKeyboard);
    const keyboard = getKeyboardFromDevice(selectedKeyboard);
    if (api && keyboard.lights) {
      const val = await api.getRGBMode();
      const newVal = val !== 0 ? 0 : 9;
      api.setRGBMode(newVal);
      api.timeout(200);
      api.setRGBMode(val);
      api.timeout(200);
      api.setRGBMode(newVal);
      api.timeout(200);
      await api.setRGBMode(val);
    }
  }

  async updateFullMatrix(activeLayer: number, selectedKeyboard: Device) {
    const api = this.getAPI(selectedKeyboard);
    const matrixLayout = this.getMatrixLayout(selectedKeyboard);
    if (api && matrixLayout) {
      const layerCount = await api.getLayerCount();
      const layerMatrixKeycodes = await api.readMatrix(activeLayer);
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

  renderMenu(selectedTitle: string | null, selectedKeyboard: Device | null) {
    const api = this.getAPI(selectedKeyboard);
    const {backlightVersion} = this.state;
    if (selectedTitle === Title.KEYS) {
      return (
        <KeycodeMenu updateSelectedKey={this.updateSelectedKey.bind(this)} />
      );
    } else if (
      selectedTitle === Title.LIGHTING &&
      api &&
      backlightVersion === BACKLIGHT_PROTOCOL_WILBA
    ) {
      return (
        <LightingMenu
          api={api}
          lightingData={this.state.lightingData}
          updateColor={this.updateColor.bind(this, api)}
          updateRGBMode={this.updateRGBMode.bind(this, api)}
          saveLighting={() => api && this.saveLighting(api)}
          setRGBMode={this.setRGBMode.bind(this)}
        />
      );
    } else if (selectedTitle === Title.LIGHTING && api && false) {
      return <div />;
    } else if (selectedTitle === Title.DEBUG) {
      return <DebugMenu api={api} />;
    }
    const keyboardMeta = getKeyboardFromDevice(selectedKeyboard);
    const MenuComponent = (keyboardMeta.customConfig || {})[selectedTitle];
    return MenuComponent ? <MenuComponent api={api} /> : <div />;
  }

  async offsetKeyboard(offset: number) {
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
        loaded: false,
        activeLayer: 0
      });
      const protocolCorrect = await this.isCorrectProtocol(selectedKeyboard);
      if (protocolCorrect) {
        await this.toggleLights(selectedKeyboard);
        await this.updateKeyboardLightingAndMatrixData(selectedKeyboard);
        this.setLoaded();
      }
    }
  }

  async updateKeyboardLightingAndMatrixData(selectedKeyboard: Device) {
    const keyboard = getKeyboardFromDevice(selectedKeyboard);
    const api = this.getAPI(selectedKeyboard);
    if (api) {
      this.setProgress(0);
      const backlightVersion = await api.getBacklightProtocolVersion();
      this.setState({backlightVersion});
      if (backlightVersion !== BACKLIGHT_PROTOCOL_NONE) {
        await this.getCurrentLightingSettings(selectedKeyboard);
      }
      this.setProgress(0.05);
      await this.updateFullMatrix(0, selectedKeyboard);
      await this.updateFullMatrix(1, selectedKeyboard);
      this.setProgress(0.6);
      await this.updateFullMatrix(2, selectedKeyboard);
      await this.updateFullMatrix(3, selectedKeyboard);
      this.setProgress(1);
    }
  }

  getLayerMatrix(
    selectedKeyboard: Device | null,
    selectedLayer: number | null
  ) {
    if (selectedKeyboard && selectedLayer !== null) {
      const deviceMatrixKeycodes = this.state.matrixKeycodes[
        selectedKeyboard.path
      ] || [[], [], [], []];
      return deviceMatrixKeycodes[selectedLayer];
    }
  }

  updateLayer(activeLayer: number) {
    this.setState({activeLayer});
    const {selectedKeyboard} = this.state;
    if (selectedKeyboard) {
      this.updateFullMatrix(activeLayer, selectedKeyboard);
    }
  }

  updateBrightness(api: KeyboardAPI, brightness: number) {
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

  updateColor(api: KeyboardAPI, num: number, hue: number, sat: number) {
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

  updateRGBMode(api: KeyboardAPI, rgbMode: number) {
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
      loaded,
      backlightVersion,
      lightingData,
      ready,
      progress,
      selectedKey,
      matrixKeycodes,
      selectedKeyboard,
      selectedTitle
    } = this.state;
    const api = this.getAPI(selectedKeyboard);
    return (
      <div className={styles.home}>
        <LoadingScreen detected={detected} ready={ready} progress={progress} />
        {detected && ready && (
          <React.Fragment>
            <TitleBar
              key="title-bar"
              selectedTitle={selectedTitle}
              backlightVersion={backlightVersion}
              getKeyboard={this.getKeyboard.bind(this)}
              setSelectedTitle={this.setSelectedTitle.bind(this)}
            />
            <Keyboard
              activeLayer={activeLayer}
              ref={keyboard => (this.keyboard = keyboard)}
              connected={connected}
              detected={detected}
              loaded={loaded}
              selectedKey={selectedKey}
              selectedKeyboard={selectedKeyboard}
              selectedTitle={selectedTitle}
              matrixKeycodes={this.getLayerMatrix(
                selectedKeyboard,
                activeLayer
              )}
              lightingData={lightingData}
              clearSelectedKey={this.clearSelectedKey.bind(this)}
              updateSelectedKey={this.setSelectedKey.bind(this)}
              setReady={this.setReady.bind(this)}
              updateFullMatrix={this.updateFullMatrix.bind(this)}
              updateLayer={this.updateLayer.bind(this)}
              updateBrightness={brightness =>
                api && this.updateBrightness(api, brightness)
              }
              showCarouselButtons={this.state.keyboards.length > 1}
              prevKeyboard={() => this.offsetKeyboard(-1)}
              nextKeyboard={() => this.offsetKeyboard(1)}
            />
            <div className={styles.container} data-tid="container">
              <div className={styles.menuContainer}>
                {this.renderMenu(selectedTitle, selectedKeyboard)}
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}
