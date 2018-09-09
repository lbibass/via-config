import React, {Component} from 'react';
export class Wilba extends Component {
  constructor(props) {
    super();
    this.state = {
      textVal: 'Here is a textarea for you :)'
    };
  }

  onChange(event) {
    const text = event.target.value;
    this.setState({textVal: text});
  }
  onClick() {
    alert(this.state.textVal);
  }

  render() {
    return (
      <div>
        <textarea
          value={this.state.textVal}
          onChange={this.onChange.bind(this)}
        />
        <button onClick={this.onClick.bind(this)}>Wilba button</button>
      </div>
    );
  }
}
