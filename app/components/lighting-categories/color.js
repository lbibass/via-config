import React, {Component} from 'react';
import styles from './color.css';
import {
  getRGBPrime,
  toDegrees,
  calcHue,
  calcMagnitude
} from '../../utils/color-math';

export class ColorCategory extends Component {
  constructor(props) {
    super();
    this.state = {
      lensTransform: '',
      selectedColor: {
        hue: null,
        sat: null,
        rgb: null,
        lensTransform: null
      }
    };
  }

  onMouseMove(evt) {
    const {offsetX, offsetY} = evt.nativeEvent;
    const lensTransform = `translate3d(${offsetX - 5}px, ${offsetY - 5}px, 0)`;
    const hue = toDegrees(calcHue(offsetX, offsetY));
    const sat = Math.min(1, calcMagnitude(offsetX, offsetY));

    const c = sat;
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = 1 - c;
    const [r, g, b] = getRGBPrime(hue, c, x).map(n =>
      Math.round(255 * (m + n))
    );
    const rgb = `rgba(${r},${g},${b},1)`;
    this.setState({
      lensTransform,
      selectedColor: {
        hue,
        sat,
        rgb
      }
    });
  }

  onClick(evt) {
    const {hue, sat} = this.state.selectedColor;
    this.props.setColor(Math.round(255 * (hue / 360)), Math.round(255 * sat));
  }

  render() {
    return (
      <div style={{background: this.state.selectedColor.rgb}}>
        <div
          onClick={this.onClick.bind(this)}
          onMouseMove={this.onMouseMove.bind(this)}
          className={styles.container}
        >
          <div className={styles.outer}>
            <div className={styles.inner}>
              <div
                className={styles.lens}
                style={{transform: this.state.lensTransform}}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
