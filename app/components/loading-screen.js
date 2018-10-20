import React, {Component} from 'react';
import styles from './loading-screen.css';
import xoAnimation from './xo_slidingpuzzle.json';
const lottie = require('lottie-web');

export class LoadingScreen extends Component {
  componentDidMount() {
    lottie.loadAnimation({
      container: this.ref,
      animType: 'svg',
      loop: true,
      animationData: xoAnimation
    });
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.ready && this.props.ready) {
      const animation = this.ref.animate(
        [
          {opacity: '1', easing: 'ease-out'},
          {opacity: '0', easing: 'ease-out'}
        ],
        {
          duration: 400,
          iterations: 1
        }
      );
      animation.onfinish = () => (this.ref.style.zIndex = 'initial');
    }
  }

  render() {
    return (
      <div ref={ref => (this.ref = ref)} className={styles.loadingScreen} />
    );
  }
}
