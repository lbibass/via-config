// @flow
import React, {Component} from 'react';
import styles from './loading-screen.css';
import xoAnimation from './xo_slidingpuzzle.json';
const lottie = require('lottie-web');

type Props = {
  progress: number,
  ready: boolean
};

export class LoadingScreen extends Component<Props> {
  containerRef: HTMLDivElement | null;
  animationRef: HTMLDivElement | null;
  componentDidMount() {
    if (this.animationRef) {
      lottie.loadAnimation({
        container: this.animationRef,
        animType: 'svg',
        loop: true,
        animationData: xoAnimation
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    const ref = this.containerRef;
    if (!prevProps.ready && this.props.ready && ref !== null) {
      const animation = ref.animate(
        [
          {opacity: '1', easing: 'ease-out'},
          {opacity: '0', easing: 'ease-out'}
        ],
        {
          duration: 400,
          iterations: 1
        }
      );
      animation.onfinish = () => (ref.style.zIndex = 'initial');
    }
  }

  render() {
    return (
      <div
        className={styles.loadingScreen}
        ref={ref => (this.containerRef = ref)}
      >
        <div
          className={styles.loadingScreenAnimation}
          ref={ref => (this.animationRef = ref)}
        />
        <div className={styles.progressBar}>
          <div
            style={{width: `${this.props.progress * 100}%`}}
            className={styles.progress}
          />
        </div>
      </div>
    );
  }
}
