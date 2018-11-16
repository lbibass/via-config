import React, {Component} from 'react';
import styles from './pattern.css';

// TODO: this is where we want this info, near the effect names
// Ideally, in the same data struture!
// const ColorsNeeded = [0, 1, 2, 2, 2, 0, 0, 0, 0, 0, 1];

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
  'Radial All Hues',
  'Radial Color 1xxx'
];

export class PatternCategory extends Component {
  updatePattern(patternNum) {
    this.props.setRGBMode(patternNum);
  }

  render() {
    const {rgbMode} = this.props;
    return (
      <div className={styles.patternContainer}>
        {Pattern.map((p, idx) => (
          <div
            className={[
              rgbMode === idx && styles.selected,
              styles.pattern
            ].join(' ')}
            onClick={() => this.updatePattern(idx)}
            key={idx}
          >
            {p}
          </div>
        ))}
      </div>
    );
  }
}
