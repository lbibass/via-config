import React, {Component} from 'react';
import styles from './key-overlay.css';
import {KeyboardAPI} from '../utils/keyboard-api';
import {getKeycodeForByte} from '../utils/key';

export class KeyOverlay extends Component {
  render() {
    const {
      device,
      matrixKeycodes,
      matrixLayout,
      selectedKey,
      useMatrixKeycodes
    } = this.props;
    if (selectedKey) {
      const sKey = parseInt(selectedKey);
      const {row, col} = matrixLayout[sKey];
      const keycode = matrixKeycodes[sKey];
      return (
        <div
          className={[!!selectedKey && styles.selected, styles.keyOverlay].join(
            ' '
          )}
        >
          {getKeycodeForByte(keycode)}
        </div>
      );
    }
    return <div className={styles.keyOverlay} />;
  }
}
