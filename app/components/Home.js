// @flow
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import styles from './Home.css';
import {Key} from './Key';
import {CenterKey} from './CenterKey';
import {ZEAL_65, parseKLERaw} from '../utils/kle-parser';
import {getKeycodes, isAlpha, isNumericSymbol} from '../utils/key';
import {getKeyboards} from '../utils/hid-keyboards';
import {Wilba} from './Wilba';
type Props = {};

export default class Home extends Component<Props, {}> {
  props: Props;

  constructor() {
    super();
    const keyboards = getKeyboards();
    const firstKeyboard = keyboards[0];

    this.state = {
      keyboards,
      selectedKeyboard: firstKeyboard && firstKeyboard.path
    };
  }

  buildKeyboard() {
    return (
      <div className={styles.keyboard}>
        {parseKLERaw(ZEAL_65).map(arr => (
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

  componentDidMount() {
    setInterval(this.updateDevices.bind(this), 500);
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
      <div>
        <div className={styles.container} data-tid="container">
          <h2>Devices:</h2>
          <button onClick={() => this.updateDevices()}>Refresh Devices</button>
          {this.renderDevicesDropdown(this.state.keyboards)}
          {this.state.selectedKeyboard && (
            <Wilba keyboard={this.state.selectedKeyboard} />
          )}
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
