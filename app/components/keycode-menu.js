import React, {Component} from 'react';
import styles from './keycode-menu.css';
import {getByteForCode, getKeycodes} from '../utils/key';

const menu = getKeycodes();
export class KeycodeMenu extends Component {
  constructor() {
    super();
    this.state = {
      selectedCategory: menu[0].label
    };
  }
  renderCategories() {
    const {selectedCategory} = this.state;
    return (
      <div className={styles.categories}>
        {menu.map(({label, keycodes}) => (
          <div
            onClick={_ => this.setState({selectedCategory: label})}
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
    const menu = getKeycodes();
    const selectedCategoryKeycodes = menu.find(
      ({label}) => label === this.state.selectedCategory
    ).keycodes;
    return (
      <div className={styles.menuContainer}>
        {this.renderCategories()}
        <div className={styles.keycodes}>
          {selectedCategoryKeycodes.map(({code, title, name}) => (
            <div alt={title} className={styles.keycode}>
              {name}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
