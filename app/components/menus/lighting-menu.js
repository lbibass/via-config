import React, {Component} from 'react';
import {
  BrightnessCategory,
  ColorCategory,
  PatternCategory
} from '../lighting-categories';
import styles from './lighting-menu.css';

export const Category = {
  Pattern: 'Patterns',
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
      const colorsNeededArr = [0, 1, 2, 2, 2, 0, 0, 0, 0, 1, 0];
      const colorsNeeded = colorsNeededArr[rgbMode];
      switch (category) {
        case Category.Pattern:
          return (
            <div>
              <PatternCategory
                rgbMode={rgbMode}
                setRGBMode={mode => this.setRGBMode(mode)}
              />
              <div className={styles.colorControls}>
                {colorsNeeded === 0 ? null : colorsNeeded === 1 ? (
                  <ColorCategory
                    label={'Primary Color'}
                    color={color1}
                    setColor={(hue, sat) => this.setColor(1, hue, sat)}
                  />
                ) : (
                  <React.Fragment>
                    <ColorCategory
                      label={'Primary Color'}
                      color={color1}
                      setColor={(hue, sat) => this.setColor(1, hue, sat)}
                    />
                    <ColorCategory
                      label={'Secondary Color'}
                      color={color2}
                      setColor={(hue, sat) => this.setColor(2, hue, sat)}
                    />
                  </React.Fragment>
                )}
              </div>
            </div>
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
