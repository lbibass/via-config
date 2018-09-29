import React, {Component} from 'react';
import styles from './title-bar.css';

export const Title = {
  KEYS: 'Keys',
  LIGHTING: 'Lighting'
};

export class TitleBar extends Component {
  render() {
    const {selectedTitle} = this.props;
    const titleOrder = [Title.KEYS, Title.LIGHTING];
    const keyboard = this.props.getKeyboard();
    const name = (keyboard && keyboard.name) || 'M60A';
    return (
      <div className={styles.titleBarContainer}>
        <div className={styles.titles}>
          <div className={styles.kbName}>{name}</div>
          {titles.map(title => (
            <div
              onClick={_ => this.props.setSelectedTitle(title)}
              className={[
                title === selectedTitle && styles.selected,
                styles.title
              ].join(' ')}
            >
              {title}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
