import React, {Component} from 'react';
import styles from './keycode-menu.css';
import {getByteForCode, getKeycodes} from '../utils/key';

export class KeycodeMenu extends Component {
  render() {
    return (
      <div className={styles.keycodeMenu}>
        {getKeycodes().map(({code, name}) => (
          <div className={styles.keycode}>{name}</div>
        ))}
      </div>
    );
  }
}
