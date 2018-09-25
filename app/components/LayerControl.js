import React, {Component} from 'react';
import styles from './LayerControl.css';

export class LayerControl extends Component {
  changeLayer(offset) {
    const newLayer = Math.min(5, Math.max(0, this.props.activeLayer + offset));
    this.props.updateLayer(newLayer);
  }
  render() {
    const {activeLayer} = this.props;
    return (
      <div className={styles.layerControl}>
        <button onClick={() => this.changeLayer(-1)}>Dec</button>
        Layer {activeLayer}
        <button onClick={() => this.changeLayer(1)}>Inc</button>
      </div>
    );
  }
}
