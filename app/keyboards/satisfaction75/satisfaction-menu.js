import React, { Component } from 'react';
import styled from 'styled-components';
import { KeyboardAPI } from '../../utils/keyboard-api';
import { getEncoderModes } from './satisfaction-api';
import EncoderModeToggle from './encoder-mode-toggle';

type Props = {api: KeyboardAPI};

const MenuContainer = styled.div`
    display: flex;
    color: black;
`;

export class SatisfactionMenu extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = { enabledModes: 0x1F };
  }

  componentDidMount() {
    const { api } = this.props;
    const promises = [
      getEncoderModes(api),
    ];
    Promise.all(promises).then(([enabledModes]) => {
      this.setState({ enabledModes });
      return { enabledModes };
    }).catch(() => { this.setState({ isFailedLoad: true }); });
  }

  render() {
    const { api } = this.props;
    const { enabledModes } = this.state;
    if (api) {
      return (
        <MenuContainer>
          <EncoderModeToggle onChange={e => console.log(e)} enabledModes={enabledModes} />
        </MenuContainer>
      );
    }
    return null;
  }
}

export default SatisfactionMenu;
