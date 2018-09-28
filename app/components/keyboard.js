import React, {Component} from 'react';
import {CenterKey} from './CenterKey';
import {Key} from './Key';
import {KeyOverlay} from './key-overlay';
import styles from './keyboard.css';
import {getLayoutFromDevice} from '../utils/hid-keyboards';
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
      clearSelectedKey,
      updateLayer
    } = this.props;
    const detected = !!selectedKeyboard;
    const selectedLayout =
      selectedKeyboard && getLayoutFromDevice(selectedKeyboard);
    const layout = selectedLayout || parseKLERaw(HHKB);
    return (
      <div onClick={clearSelectedKey} className={styles.keyboardContainer}>
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
        <LayerControl updateLayer={updateLayer} activeLayer={activeLayer} />
        <KeyOverlay selectedKey={selectedKey} />
      </div>
    );
  }
}
