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
  updatePattern(patternNum) {
    this.props.setRGBMode(patternNum);
  }

  render() {
    return (
      <div>
        {Pattern.map((p, idx) => (
          <div onClick={() => this.updatePattern(idx)} key={idx}>
            {p}
          </div>
        ))}
      </div>
    );
  }
}
