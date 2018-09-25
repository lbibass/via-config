// @flow
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import styles from './Home.css';
import {Key} from './Key';
import {LayerControl} from './LayerControl';
import {CenterKey} from './CenterKey';
import {ZEAL65, HHKB, parseKLERaw} from '../utils/kle-parser';
import {
  getByteForCode,
  getKeycodes,
  isAlpha,
  isNumericSymbol
} from '../utils/key';
import {getKeyboards, getLayoutFromDevice} from '../utils/hid-keyboards';
import {Wilba} from './Wilba';
type Props = {};

const OVERRIDE_DETECT = true;

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

  buildKeyboard(detected) {
    const kb = this.state.selectedKeyboard;
    const selectedLayout = kb && getLayoutFromDevice(kb);
    const layout = selectedLayout || parseKLERaw(ZEAL65);
    return (
      <div className={styles.keyboardContainer}>
        <div
          className={[
            styles.keyboard,
            (detected || OVERRIDE_DETECT) && styles.detected
          ].join(' ')}
        >
          {layout.map((arr, row) => (
            <div className={styles.row}>
              {arr.map((key, column) =>
                this.chooseKey(key, `${row}-${column}`)
              )}
            </div>
          ))}
        </div>
        <LayerControl
          updateLayer={activeLayer => this.setState({activeLayer})}
          activeLayer={this.state.activeLayer}
        />
      </div>
    );
  }

  setSelectedKey(idx, evt) {
    this.setState({selectedKey: idx});
    evt.stopPropagation();
  }

  chooseKey({label, size, margin}, idx: string) {
    if (isAlpha(label)) {
      return (
        label && (
          <Key
            label={label}
            size={size}
            indent={margin}
            selected={this.state.selectedKey === idx}
            onClick={this.setSelectedKey.bind(this, idx)}
          />
        )
      );
    } else if (isNumericSymbol(label)) {
      const topLabel = label[0];
      const bottomLabel = label[label.length - 1];
      return (
        topLabel &&
        bottomLabel && (
          <Key
            topLabel={topLabel}
            bottomLabel={bottomLabel}
            indent={margin}
            size={size}
            selected={this.state.selectedKey === idx}
            onClick={this.setSelectedKey.bind(this, idx)}
          />
        )
      );
    } else {
      return (
        <CenterKey
          label={label}
          indent={margin}
          size={size}
          selected={this.state.selectedKey === idx}
          onClick={this.setSelectedKey.bind(this, idx)}
        />
      );
    }
  }

  componentDidMount() {
    this.scanTimeout = setInterval(this.updateDevices.bind(this), 500);
  }

  componentWillUnmount() {
    clearInterval(this.scanTimeout);
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
      <div onClick={this.clearSelectedKey.bind(this)}>
        <div className={styles.container} data-tid="container">
          <h2>Devices:</h2>
          <button onClick={() => this.updateDevices()}>Refresh Devices</button>
          {this.renderDevicesDropdown(this.state.keyboards)}
          {this.buildKeyboard(!!this.state.selectedKeyboard)}
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
