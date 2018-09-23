// @flow
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import styles from './Home.css';
import {Key} from './Key';
import {CenterKey} from './CenterKey';
import {ZEAL_65, HHKB, parseKLERaw} from '../utils/kle-parser';
import {
  getByteForCode,
  getKeycodes,
  isAlpha,
  isNumericSymbol
} from '../utils/key';
import {getKeyboards} from '../utils/hid-keyboards';
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
      selectedKeyboard: firstKeyboard && firstKeyboard.path,
      selectedKey: null
    };
  }

  clearSelectedKey(evt) {
    this.setState({selectedKey: null});
  }

  buildKeyboard(detected) {
    return (
      <div className={styles.keyboardContainer}>
        <div
          className={[
            styles.keyboard,
            (detected || OVERRIDE_DETECT) && styles.detected
          ].join(' ')}
        >
          {parseKLERaw(HHKB).map((arr, row) => (
            <div className={styles.row}>
              {arr.map((key, column) =>
                this.chooseKey(key, `${row}-${column}`)
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  setSelectedKey(idx, evt) {
    this.setState({selectedKey: idx});
    evt.stopPropagation();
  }

  chooseKey({label, size}, idx: string) {
    if (isAlpha(label)) {
      return (
        label && (
          <Key
            label={label}
            size={size}
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
      keyboards.find(keyboard => keyboard.path === oldSelectedKeyboard) ||
      keyboards[0];
    const selectedKeyboard = selectedKeyboardObj && selectedKeyboardObj.path;
    this.setState({keyboards, selectedKeyboard});
  }

  renderDevicesDropdown(devices) {
    return (
      <select
        value={this.state.selectedKeyboard}
        onChange={evt => this.setState({selectedKeyboard: evt.target.value})}
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
            <Wilba keyboard={this.state.selectedKeyboard} />
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
