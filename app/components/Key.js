// @flow
import * as React from 'react';
import {Component} from 'react';
import styles from './Key.css';

export type Props = {
  label?: string,
  centerLabel?: boolean,
  topLabel?: string,
  bottomLabel?: string,
  c: string,
  t: string,
  size: number,
  indent?: number,
  selected: boolean,
  marginTop?: number,
  onClick: (evt: any) => void
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

  getMarginTopClass(){
    const {marginTop = 0} = this.props;
    return styles[`vIndent${marginTop}U`];
  }

  getDarkenedColor(color: string) {
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
    return res;
  }

  renderLegend(labels: (string | void)[], t: string): React$Element<'span'>[] {
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
          this.getSizeClass(),
          this.getMarginTopClass(),
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
            <div className={isSmall && centerLabel ? styles.smallInnerCenterKeyContainer : styles.innerKeyContainer}>
              {this.renderLegend(
                isSmall && !centerLabel ? [topLabel, bottomLabel] : [label],
                t
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
