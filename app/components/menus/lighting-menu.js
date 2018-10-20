import React, {Component} from 'react';
import {
  BrightnessCategory,
  ColorCategory,
  PatternCategory
} from '../lighting-categories';
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
      selectedCategory: Category.Pattern,
      lightingData: null
    };
  }

  async getCurrentLightingSettings() {
    const {api} = this.props;
    if (api) {
      const promises = [
        api.getRGBMode(),
        api.getBrightness(),
        api.getColor(1),
        api.getColor(2)
      ];
      const [rgbMode, brightness, color1, color2] = await Promise.all(promises);
      const lightingData = {
        rgbMode,
        brightness,
        color1,
        color2
      };
      console.log(lightingData);
      this.setState({lightingData});
    }
  }

  componentWillMount() {
    this.getCurrentLightingSettings();
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

  setColor(num, hue, sat) {
    const {lightingData} = this.state;
    if (num === 1) {
      this.setState({
        lightingData: {
          ...lightingData,
          color1: {hue, sat}
        }
      });
    } else if (num === 2) {
      this.setState({
        lightingData: {
          ...lightingData,
          color2: {hue, sat}
        }
      });
    }
    this.props.api.setColor(num, hue, sat);
  }

  setBrightness(brightness) {
    const {lightingData} = this.state;
    this.setState({
      lightingData: {
        ...lightingData,
        brightness
      }
    });
    this.props.api.setBrightness(brightness);
  }

  setRGBMode(rgbMode) {
    const {lightingData} = this.state;
    this.setState({
      lightingData: {
        ...lightingData,
        rgbMode
      }
    });
    this.props.api.setRGBMode(rgbMode);
  }

  renderSelectedCategory(category) {
    const {lightingData} = this.state;
    const {api} = this.props;

    if (api && lightingData) {
      const {color1, color2, brightness, rgbMode} = lightingData;
      switch (category) {
        case Category.Brightness:
          return (
            <BrightnessCategory
              brightness={brightness}
              setBrightness={brightness => this.setBrightness(brightness)}
            />
          );
        case Category.Color1:
          return (
            <ColorCategory
              color={color1}
              setColor={(hue, sat) => this.setColor(1, hue, sat)}
            />
          );
        case Category.Color2:
          return (
            <ColorCategory
              color={color2}
              setColor={(hue, sat) => this.setColor(2, hue, sat)}
            />
          );
        case Category.Pattern:
          return (
            <PatternCategory
              rgbMode={rgbMode}
              setRGBMode={mode => this.setRGBMode(mode)}
            />
          );
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
