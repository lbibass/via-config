import React, {Component} from 'react';
import styles from './debug-menu.css';
export class DebugMenu extends Component {
  render() {
    const {api} = this.props;
    if (api) {
      return (
        <div>
          <input type="button">Reset</input>
          <input type="button">Jump to bootloader</input>
        </div>
      );
    }
    return null;
  }
}
