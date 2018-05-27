// @flow
import React, { Component } from 'react';
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

  renderLegend(labels: string[]) {
    return labels.map(label => <span className={styles.legend}>{label}</span>);
  }

  render() {
    const {
      label,
      topLabel,
      bottomLabel,
      centerLabel,
    } = this.props;
    const isSmall = topLabel !== undefined || centerLabel !== undefined;
    return (
      <div className={[styles.outerKey, this.getSizeClass()].join(' ')}>
        <div className={isSmall ? styles.smallInnerKey : styles.innerKey}>
          <div className={styles.innerKeyContainer}>
            {this.renderLegend(isSmall ? [topLabel, bottomLabel] : [label])}
          </div>
        </div>
      </div>
    );
  }
}
