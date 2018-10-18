import React, {Component} from 'react';
import {BrightnessCategory} from './lighting-categories/brightness';
import {ColorCategory} from './lighting-categories/color';
import {PatternCategory} from './lighting-categories/pattern';
import styles from './lighting-menu.css';

export const Category = {
  Pattern: 'Pattern',
  Color1: 'Primary Color',
  Color2: 'Secondary Color',
  Brightness: 'Brightness'
};

export class LightingMenu extends Component {
  constructor(props) {
    super();
    this.state = {
      selectedCategory: Category.Pattern
    };
  }

  renderCategories() {
    const {selectedCategory} = this.state;
    const menu = [
      Category.Color1,
      Category.Color2,
      Category.Pattern,
      Category.Brightness
    ];
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

  renderSelectedCategory(category) {
    const {api} = this.props;

    if (api) {
      switch (category) {
        case Category.Brightness:
          return (
            <BrightnessCategory
              setBrightness={brightness => api.setBrightness(brightness)}
            />
          );
        case Category.Color1:
          return (
            <ColorCategory setColor={(hue, sat) => api.setColor(1, hue, sat)} />
          );
        case Category.Color2:
          return (
            <ColorCategory setColor={(hue, sat) => api.setColor(2, hue, sat)} />
          );
        case Category.Pattern:
          return <PatternCategory setRGBMode={mode => api.setRGBMode(mode)} />;
      }
    }
    return null;
  }

  render() {
    return (
      <div className={styles.menu}>
        {this.renderCategories()}
        {this.renderSelectedCategory(this.state.selectedCategory)}
      </div>
    );
  }
}
