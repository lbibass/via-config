import React, {Component} from 'react';
import styles from './keycode-menu.css';
import {
  keycodeInMaster,
  getByteForCode,
  getKeycodes,
  getOtherMenu
} from '../utils/key';

const menu = getKeycodes().concat(getOtherMenu());
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
    const {mouseOverDesc} = this.state;
    const selectedCategoryKeycodes = menu.find(
      ({label}) => label === this.state.selectedCategory
    ).keycodes;

    return (
      <div className={styles.menu}>
        {this.renderCategories()}
        <div className={styles.keycodeDesc}>{mouseOverDesc}</div>
        <div className={styles.keycodes}>
          {selectedCategoryKeycodes.map(({code, title, name}) => (
            <div
              alt={title}
              className={[
                !keycodeInMaster(code) && styles.disabled,
                styles.keycode
              ].join(' ')}
              key={code}
              onClick={() =>
                keycodeInMaster(code) &&
                this.props.updateSelectedKey(getByteForCode(code))
              }
              onMouseOver={_ => {
                this.setState({
                  mouseOverDesc: title ? `${code}: ${title}` : code
                });
              }}
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
