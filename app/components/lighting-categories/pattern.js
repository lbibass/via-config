import React, {Component} from 'react';
import styles from './pattern.css';

export class PatternCategory extends Component {
  onRangeChange(event) {
    const pattern = parseInt(event.target.value);
    this.props.setRGBMode(pattern);
  }

  render() {
    return (
      <div>
        <input
          type="range"
          value={this.props.rgbMode}
          onChange={this.onRangeChange.bind(this)}
          min={0}
          max={10}
        />
      </div>
    );
  }
}
