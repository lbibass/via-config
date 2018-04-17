// @flow
import React, { Component } from 'react';
import styles from './Key.css';

type Props = {
  label: string
};

export default class Key extends Component<Props> {
  props: Props;

  render() {
    const {
      label
    } = this.props;
    return (
      <div className={styles.outerKey}>
        <div className={styles.innerKey}>
          {label}
        </div>
      </div>
    );
  }
}
