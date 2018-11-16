// @flow
import * as React from 'react';
import styles from './LayerControl.css';

type Props = {
  activeLayer: number | null,
  showLayer: boolean,
  loaded: boolean,
  updateLayer: (layer: number) => void
};

export class LayerControl extends React.Component<Props> {
  get minLayer() {
    return 0;
  }

  get maxLayer() {
    return 3;
  }

  changeLayer(offset: number) {
    const newLayer = Math.min(
      this.maxLayer,
      Math.max(this.minLayer, this.props.activeLayer + offset)
    );
    this.props.updateLayer(newLayer);
  }
  render() {
    const {activeLayer, showLayer, loaded} = this.props;

    return (
      <div
        className={[
          loaded && showLayer && styles.showLayer,
          styles.layerControl
        ].join(' ')}
      >
        <button className={styles.button} onClick={() => this.changeLayer(-1)}>
          ∨
        </button>
        <div className={styles.label}>Layer {activeLayer}</div>
        <button className={styles.button} onClick={() => this.changeLayer(1)}>
          ∧
        </button>
      </div>
    );
  }
}
