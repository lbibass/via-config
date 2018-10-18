import React, {Component} from 'react';
import styles from './pattern.css';

export class PatternCategory extends Component {
  constructor(props) {
    super();
    this.state = {
      pattern: 5
    };
  }

  onRangeChange(event) {
    const pattern = parseInt(event.target.value);
    this.setState({pattern});
    this.props.setRGBMode(pattern);
  }

  render() {
    return (
      <div>
        <input
          type="range"
          value={this.state.pattern}
          onChange={this.onRangeChange.bind(this)}
          min={0}
          max={10}
        />
      </div>
    );
  }
}
