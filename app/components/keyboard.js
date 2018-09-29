import React, {Component} from 'react';
import {CenterKey} from './CenterKey';
import {Key} from './Key';
import {KeyOverlay} from './key-overlay';
import {Title} from './title-bar';
import styles from './keyboard.css';
import {
  getKeyboardFromDevice,
  getLayoutFromDevice
} from '../utils/hid-keyboards';
import {MatrixLayout} from '../utils/layout-parser';
import {M6B, ZEAL65, HHKB, parseKLERaw} from '../utils/kle-parser';
import {LayerControl} from './LayerControl';
import {isAlpha, isNumericSymbol} from '../utils/key';
const OVERRIDE_DETECT = true;

export class Keyboard extends Component {
  chooseKey({label, size, margin}, idx: string) {
    const {selectedKey, setSelectedKey} = this.props;
    const onClick = evt => {
      evt.stopPropagation();
      setSelectedKey(idx);
    };
    if (isAlpha(label)) {
      return (
        label && (
          <Key
            label={label}
            size={size}
            indent={margin}
            selected={selectedKey === idx}
            onClick={onClick}
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
            selected={selectedKey === idx}
            onClick={onClick}
          />
        )
      );
    } else {
      return (
        <CenterKey
          label={label}
          indent={margin}
          size={size}
          selected={selectedKey === idx}
          onClick={onClick}
        />
      );
    }
  }

  render() {
    const {
      activeLayer,
      selectedKey,
      selectedKeyboard,
      selectedTitle,
      clearSelectedKey,
      updateLayer,
      matrixKeycodes
    } = this.props;
    const detected = !!selectedKeyboard;
    const device = selectedKeyboard || {vendorId: 0x5241, productId: 0x060a};
    const keyboard = getKeyboardFromDevice(device);
    const selectedLayout = getLayoutFromDevice(device);
    const matrixLayout = MatrixLayout[keyboard.name];
    const showLayer = selectedTitle === Title.KEYS;
    console.log(showLayer);
    let keyCounter = 0;
    return (
      <div onClick={clearSelectedKey} className={styles.keyboardContainer}>
        <div
          className={[
            styles.keyboard,
            (detected || OVERRIDE_DETECT) && styles.detected
          ].join(' ')}
        >
          {selectedLayout.map((arr, row) => (
            <div className={styles.row}>
              {arr.map((key, column) => this.chooseKey(key, `${keyCounter++}`))}
            </div>
          ))}
        </div>
        <LayerControl
          showLayer={showLayer}
          updateLayer={updateLayer}
          activeLayer={activeLayer}
        />
        <KeyOverlay
          device={device}
          matrixLayout={matrixLayout}
          matrixKeycodes={matrixKeycodes}
          selectedKey={selectedKey}
        />
      </div>
    );
  }
}
