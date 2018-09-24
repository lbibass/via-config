// @flow
import React, {Component} from 'react';
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

  getIndentClass() {
    const {indent = 0} = this.props;
    return styles[`indent${indent}U`];
  }

  render() {
    const {label} = this.props;

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
          className={[
            this.props.selected && styles.selected,
            styles.outerKey
          ].join(' ')}
        >
          <div className={styles.smallInnerKey}>
            <div className={styles.smallInnerCenterKeyContainer}>
              {this.renderLegend([label])}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
