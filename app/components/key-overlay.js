import React, {Component} from 'react';
import styles from './key-overlay.css';
import {KeyboardAPI} from '../utils/keyboard-api';
import {getKeycodeForByte} from '../utils/key';

export class KeyOverlay extends Component {
  animateSuccess() {
    this.el.animate(
      [
        {background: 'black', easing: 'ease-out'},
        {background: '#98b79a', easing: 'ease-out'},
        {background: 'black', easing: 'ease-out'}
      ],
      {duration: 600}
    );
  }

  render() {
    const {
      device,
      matrixKeycodes,
      matrixLayout,
      selectedKey,
      useMatrixKeycodes
    } = this.props;
    if (selectedKey !== null) {
      const sKey = selectedKey;
      const {row, col} = matrixLayout[sKey];
      const keycode = matrixKeycodes[sKey];
      return (
        <div
          ref={el => (this.el = el)}
          className={[
            selectedKey !== null && styles.selected,
            styles.keyOverlay
          ].join(' ')}
        >
          {getKeycodeForByte(keycode)}
        </div>
      );
    }
    return <div className={styles.keyOverlay} />;
  }
}
