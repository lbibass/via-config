// @flow
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import styles from './Home.css';
import {Key} from './Key';
import {CenterKey} from './CenterKey';
import {ZEAL_65, parseKLERaw} from '../utils/kle-parser';
import {getKeycodes, isAlpha, isNumericSymbol} from '../utils/key';
import {Wilba} from './Wilba';
const HID = require('node-hid');
const IS_OSX = require('os').platform() === 'darwin';

type Props = {};

function scanDevices() {
  const devices = HID.devices();
  return devices;
}

function getKeyboards(usbDevices: Device[]) {
  return usbDevices.filter(device => {
    const validVendor = isValidVendor(device);
    const validProduct = isValidProduct(device);
    const validInterface = isValidInterface(device);
    return validVendor && validProduct && validInterface;
  });
}

function isValidInterface(device) {
  return IS_OSX ? isValidInterfaceOSX(device) : isValidInterfaceNonOSX(device);
}

function isValidInterfaceNonOSX(device) {
  const VALID_INTERFACE_IDS = [0x0001];
  return VALID_INTERFACE_IDS.includes(device.interface);
}

function isValidInterfaceOSX({usage, usagePage}) {
  const VALID_USAGE_IDS = [0x0061];
  const VALID_USAGE_PAGE_IDS = [0xff60];
  return (
    VALID_USAGE_IDS.includes(usage) && VALID_USAGE_PAGE_IDS.includes(usagePage)
  );
}

function isValidVendor({vendorId}) {
  const VALID_VENDOR_IDS = [0xfeed];
  return VALID_VENDOR_IDS.includes(vendorId);
}

function isValidProduct({productId}) {
  // Currently allows Zeal60, Zeal65
  const VALID_PRODUCT_IDS = [0x6065, 0x6060];
  return VALID_PRODUCT_IDS.includes(productId);
}

export default class Home extends Component<Props, {}> {
  props: Props;

  constructor() {
    super();
    const devices = scanDevices();
    const firstKeyboard = getKeyboards(devices)[0];

    this.state = {
      devices,
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
    //    this.intervalId = setInterval(this.updateDevices.bind(this), 200);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  updateDevices() {
    this.setState({devices: scanDevices()});
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
    const keyboards = getKeyboards(this.state.devices);
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2>Devices:</h2>
          <Wilba keyboard={this.state.selectedKeyboard} />
          <button onClick={() => this.updateDevices()}>Refresh Devices</button>
          {this.renderDevicesDropdown(keyboards)}
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
