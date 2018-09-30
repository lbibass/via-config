import React, {Component} from 'react';
import styles from './title-bar.css';

export const Title = {
  KEYS: 'Keys',
  LIGHTING: 'Lighting'
};

export class TitleBar extends Component {
  isDetected() {
    return !!this.props.getKeyboard();
  }

  getKeyboardName() {
    const keyboard = this.props.getKeyboard();
    return (keyboard && keyboard.name) || 'M60A';
  }

  getTitlesForKeyboard(name) {
    if (name === 'M6A') {
      return [Title.KEYS];
    } else {
      return [Title.KEYS, Title.LIGHTING];
    }
  }

  render() {
    const {selectedTitle} = this.props;
    const titles = [Title.KEYS, Title.LIGHTING];

    return (
      <div className={styles.titleBarContainer}>
        <div className={styles.titles}>
          {this.isDetected() ? (
            [
              <div key="kbname" className={styles.kbName}>
                {this.getKeyboardName()}
              </div>,
              this.getTitlesForKeyboard(this.getKeyboardName()).map(title => (
                <div
                  onClick={_ => this.props.setSelectedTitle(title)}
                  key={title}
                  className={[
                    title === selectedTitle && styles.selected,
                    styles.title
                  ].join(' ')}
                >
                  {title}
                </div>
              ))
            ]
          ) : (
            <div className={[styles.kbName, styles.kbDisconnected].join(' ')}>
              No kb detected
            </div>
          )}
        </div>
      </div>
    );
  }
}
