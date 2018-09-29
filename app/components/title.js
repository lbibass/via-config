import React, {Component} from 'react';
import styles from './title.css';

export class Title extends Component {
  render() {
    const {selectedTitle} = this.props;
    const titles = ['Keys', 'Lighting'];
    const keyboard = this.props.getKeyboard();
    const name = (keyboard && keyboard.name) || 'M60A';
    console.log('what');
    return (
      <div className={styles.titleContainer}>
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
