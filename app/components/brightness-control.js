import React, {Component} from 'react';
import styles from './brightness-control.css';

export class BrightnessControl extends Component {
  onRangeChange(event) {
    this.props.updateBrightness(event.target.valueAsNumber);
  }

  render() {
    const {brightness, showControl, updateBrightness} = this.props;

    return (
      <div
        className={[
          showControl && styles.showControl,
          styles.brightnessControl
        ].join(' ')}
      >
        <span className={styles.label}>🔅</span>
        <input
          type="range"
          value={brightness}
          onChange={this.onRangeChange.bind(this)}
          min={0}
          max={255}
        />
        <span className={styles.label}>🔆</span>
      </div>
    );
  }
}
