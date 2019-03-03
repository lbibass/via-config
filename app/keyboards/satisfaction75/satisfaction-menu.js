import React, { Component } from 'react';
import styled from 'styled-components';
import Select from 'react-select';

import { KeyboardAPI } from '../../utils/keyboard-api';
import { getEncoderModes, setEncoderModes, getDefaultOLED, setDefaultOLED } from './satisfaction-api';
import { EncoderModeToggle } from './encoder-mode-toggle';


type Props = {api: KeyboardAPI};

const MenuContainer = styled.div`
    display: flex;
    color: black;
    padding: 24px;
`;

const OLEDModeContainer = styled.div`
  flex: 1 0 50px;
`;

const OLED_OPTIONS = [
  { value: 0, label: 'Default' },
  { value: 1, label: 'Time' },
  { value: 2, label: 'Off' }
];


export class SatisfactionMenu extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = { enabledModes: 0x1F, defaultOLEDMode: 0 };
  }

  componentDidMount() {
    const { api } = this.props;
    const promises = [
      getEncoderModes(api),
      getDefaultOLED(api),
    ];
    Promise.all(promises).then(([enabledModes, defaultOLEDMode]) => {
      this.setState({ enabledModes, defaultOLEDMode });
      return { enabledModes, defaultOLEDMode };
    }).catch(() => { this.setState({ isFailedLoad: true }); });
  }

  onEncoderModeChange = (newEncoderModes: number) => {
    const { api } = this.props;
    const { enabledModes: currentModes } = this.state;
    console.log(newEncoderModes);
    if (currentModes !== newEncoderModes) {
      this.setState({ enabledModes: newEncoderModes });
      setEncoderModes(api, newEncoderModes);
    }
  }

  onOLEDChange = ({ value: newDefaultOLEDMode }: {value: number}) => {
    const { api } = this.props;
    const { defaultOLEDMode: currentMode } = this.state;
    console.log(newDefaultOLEDMode);
    if (currentMode !== newDefaultOLEDMode) {
      this.setState({ defaultOLEDMode: newDefaultOLEDMode });
      setDefaultOLED(api, newDefaultOLEDMode);
    }
  }


  render() {
    const { api } = this.props;
    const { enabledModes, defaultOLEDMode } = this.state;
    if (api) {
      return (
        <MenuContainer>
          <EncoderModeToggle onChange={this.onEncoderModeChange} enabledModes={enabledModes} />
          <OLEDModeContainer>
            <Select
              value={OLED_OPTIONS.find(e => e.value === defaultOLEDMode)}
              onChange={this.onOLEDChange}
              options={OLED_OPTIONS}
          />
          </OLEDModeContainer>
        </MenuContainer>
      );
    }
    return null;
  }
}

export default SatisfactionMenu;
