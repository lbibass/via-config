import React, {Component} from 'react';
import styles from './pattern.css';

export class BrightnessCategory extends Component {
  constructor(props) {
    super();
  }

  onRangeChange(event) {
    const brightness = parseInt(event.target.value);
    this.props.setBrightness(brightness);
  }

  render() {
    return (
      <div>
        <input
          type="range"
          value={this.props.brightness}
          onChange={this.onRangeChange.bind(this)}
          min={0}
          max={255}
        />
      </div>
    );
  }
}
