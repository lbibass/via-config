import React, {Component} from 'react';
import styles from './key-overlay.css';

export class KeyOverlay extends Component {
  render() {
    const {selectedKey} = this.props;
    return (
      <div
        className={[!!selectedKey && styles.selected, styles.keyOverlay].join(
          ' '
        )}
      >
        {selectedKey}
      </div>
    );
  }
}
