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

  renderLegend(labels: string[]) {
    return labels.map(label => <span className={styles.legend}>{label}</span>);
  }

  render() {
    const {label, topLabel, bottomLabel, centerLabel} = this.props;
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
          className={[
            this.props.selected && styles.selected,
            styles.outerKey
          ].join(' ')}
        >
          <div className={isSmall ? styles.smallInnerKey : styles.innerKey}>
            <div className={styles.innerKeyContainer}>
              {this.renderLegend(isSmall ? [topLabel, bottomLabel] : [label])}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
