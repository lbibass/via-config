import React, {Component} from 'react';
import styles from './lighting-menu.css';

export const Category = {
  Pattern: 'Pattern'
};

export class LightingMenu extends Component {
  constructor(props) {
    super();
    this.state = {
      rangeVal: '5',
      selectedCategory: Category.Pattern
    };
  }

  onRangeChange(event) {
    const brightness = event.target.value;
    this.setState({rangeVal: brightness});
    this.props.setRGBMode(parseInt(brightness));
  }

  renderCategories() {
    const {selectedCategory} = this.state;
    const menu = [Category.Pattern];
    return (
      <div className={styles.categories}>
        {menu.map(label => (
          <div
            onClick={_ => this.setState({selectedCategory: label})}
            key={label}
            className={[
              label === selectedCategory && styles.selected,
              styles.category
            ].join(' ')}
          >
            {label}
          </div>
        ))}
      </div>
    );
  }

  render() {
    return (
      <div className={styles.menuContainer}>
        {this.renderCategories()}
        <input
          type="range"
          value={this.state.rangeVal}
          onChange={this.onRangeChange.bind(this)}
          min="0"
          max="10"
        />
      </div>
    );
  }
}
