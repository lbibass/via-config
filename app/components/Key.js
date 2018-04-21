// @flow
import React, { Component } from 'react';
import styles from './Key.css';

type Props = {
  label: string
};

export default class Key extends Component<Props> {
  props: Props;

  renderLegend(labels: string[]) {
    return labels.map(label => <span className={styles.legend}>{label}</span>);
  }

  render() {
    const {
      label,
      topLabel,
      bottomLabel,
    } = this.props;
    const isSmall = topLabel !== undefined;
    return (
      <div className={styles.outerKey}>
        <div className={isSmall ? styles.smallInnerKey : styles.innerKey}>
          <div className={styles.innerKeyContainer}>
            {this.renderLegend(isSmall ? [topLabel, bottomLabel] : [label])}
          </div>
        </div>
      </div>
    );
  }
}
