import React, {Component} from 'react';
import styles from './pattern.css';

const Pattern = [
  'All Off',
  'Solid Color 1',
  'Alphas/Mods Color 1/2',
  'Gradient Vertical Color 1/2',
  'Raindrops Color 1/2',
  'Cycle All',
  'Cycle Horizontal',
  'Cycle Vertical',
  'Jellybean Raindrops',
  'Radial Color 1',
  'Radial All Hues'
];

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
