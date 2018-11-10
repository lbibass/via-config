import React, {Component} from 'react';
import styles from './debug-menu.css';
import {KeyboardAPI} from '../../utils/keyboard-api';

type Props = {api: KeyboardAPI};

export class DebugMenu extends Component<Props> {
  render() {
    const {api} = this.props;
    if (api) {
      return (
        <div>
          <button onClick={() => api.resetEEPROM()}>EEPROM Reset</button>
          <button onClick={() => api.jumpToBootloader()}>
            Bootloader Jump
          </button>
        </div>
      );
    }
    return null;
  }
}
