import React, {Component} from 'react';
import styles from './keycode-menu.css';
import {getByteForCode, getKeycodes} from '../utils/key';

const menu = getKeycodes();
export class KeycodeMenu extends Component {
  constructor() {
    super();
    this.state = {
      selectedCategory: menu[0].label,
      mouseOverDesc: null
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
    const {mouseOverDesc} = this.state;
    const selectedCategoryKeycodes = menu.find(
      ({label}) => label === this.state.selectedCategory
    ).keycodes;
    return (
      <div className={styles.menuContainer}>
        {this.renderCategories()}
        <div className={styles.keycodeDesc}>{mouseOverDesc}</div>
        <div className={styles.keycodes}>
          {selectedCategoryKeycodes.map(({code, title, name}) => (
            <div
              alt={title}
              className={styles.keycode}
              onClick={() => this.props.updateSelectedKey(getByteForCode(code))}
              onMouseOver={_ => this.setState({mouseOverDesc: title})}
              onMouseOut={_ => this.setState({mouseOverDesc: null})}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
