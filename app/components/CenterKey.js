// @flow
import React, { Component } from 'react';
import {Key} from './Key';
import styles from './Key.css';

export class CenterKey extends Key {
  constructor(props) {
    super(props);
  }

  getSizeClass() {
    const {size} = this.props;
    return styles[`size${size || 100}U`];
  }

  render() {
    const {
      label,
    } = this.props;

    return (
      <div className={[styles.outerKey, this.getSizeClass()].join(' ')}>
        <div className={styles.smallInnerKey}>
          <div className={styles.smallInnerCenterKeyContainer}>
            {this.renderLegend([label])}
          </div>
        </div>
      </div>
    );
  }
}