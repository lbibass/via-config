// @flow
import React, {Component} from 'react';
import styles from './Key.css';

type Props = {
  label: string
};

export class Key extends Component<Props> {
  props: Props;

  getSizeClass() {
    const {size} = this.props;
    return styles[`size${size || 100}U`];
  }

  getIndentClass() {
    const {indent = 0} = this.props;
    return styles[`indent${indent}U`];
  }

  getDarkenedColor(color) {
    const darkOffset = 60;
    const cleanedColor = color.replace('#', '');
    const r =
      parseInt(cleanedColor[0], 16) * 16 + parseInt(cleanedColor[1], 16);
    const g =
      parseInt(cleanedColor[2], 16) * 16 + parseInt(cleanedColor[3], 16);
    const b =
      parseInt(cleanedColor[4], 16) * 16 + parseInt(cleanedColor[5], 16);
    const hr = Math.round(r * 0.8).toString(16);
    const hg = Math.round(g * 0.8).toString(16);
    const hb = Math.round(b * 0.8).toString(16);
    const res = `#${hr.padStart(2, '0')}${hg.padStart(2, '0')}${hb.padStart(
      2,
      '0'
    )}`;
    console.log(res);
    return res;
  }

  renderLegend(labels: string[], t) {
    return labels.map(label => (
      <span key={label} className={styles.legend} style={{color: t}}>
        {label}
      </span>
    ));
  }

  render() {
    const {label, topLabel, bottomLabel, centerLabel, c, t} = this.props;
    const isSmall = topLabel !== undefined || centerLabel !== undefined;
    return (
      <div
        onClick={this.props.onClick}
        className={[
          styles.keyContainer,
          this.getIndentClass(),
          this.getSizeClass()
        ].join(' ')}
      >
        <div
          style={{backgroundColor: this.getDarkenedColor(c)}}
          className={[
            this.props.selected && styles.selected,
            styles.outerKey
          ].join(' ')}
        >
          <div
            className={isSmall ? styles.smallInnerKey : styles.innerKey}
            style={{backgroundColor: c}}
          >
            <div className={styles.innerKeyContainer}>
              {this.renderLegend(
                isSmall ? [topLabel, bottomLabel] : [label],
                t
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
