import React, {Component} from 'react';
import styles from './pattern.css';

export class BrightnessCategory extends Component {
  constructor(props) {
    super();
    this.state = {
      brightness: 255
    };
  }

  onRangeChange(event) {
    const brightness = parseInt(event.target.value);
    this.setState({brightness});
    this.props.setBrightness(brightness);
  }

  render() {
    return (
      <div>
        <input
          type="range"
          value={this.state.brightness}
          onChange={this.onRangeChange.bind(this)}
          min={0}
          max={255}
        />
      </div>
    );
  }
}
