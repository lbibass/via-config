import React, { Component } from 'react';
import styled from 'styled-components';
import Select from 'react-select';

import { KeyboardAPI } from '../../utils/keyboard-api';
import { getEncoderModes, setEncoderModes, getDefaultOLED, setDefaultOLED } from './satisfaction-api';
import { EncoderModeToggle } from './encoder-mode-toggle';


type Props = {api: KeyboardAPI};

const MenuContainer = styled.div`
  display: flex;
  color: #717070;
  padding: 24px;
  font-family: GothamRounded;
  h3 {
    margin: 4px 0;
  }
  p {
    margin: 4px 0 8px 0;
    width: 288px; 
    font-size: 13px;
    text-align: center;
  }
`;

const SectionContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
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
    if (currentModes !== newEncoderModes) {
      this.setState({ enabledModes: newEncoderModes });
      setEncoderModes(api, newEncoderModes);
    }
  }

  onOLEDChange = ({ value: newDefaultOLEDMode }) => {
    const { api } = this.props;
    const { defaultOLEDMode: currentMode } = this.state;
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
          <SectionContainer>
            <EncoderModeToggle onChange={this.onEncoderModeChange} enabledModes={enabledModes} />
          </SectionContainer>
          <SectionContainer>
            <h3>Default OLED Mode:</h3>
            <p>This is the OLED mode that will be selected by default when you plug in your keyboard.</p>
            <div css="width: 156px; margin-bottom: 12px;">
              <Select
                value={OLED_OPTIONS.find(e => e.value === defaultOLEDMode)}
                onChange={this.onOLEDChange}
                options={OLED_OPTIONS}
              />
            </div>
            <h3>Current OLED Mode:</h3>
            <p>Change your keyboard's current OLED mode</p>

          </SectionContainer>
          <SectionContainer>
            <h3>Custom Encoder Configuration:</h3>
            <p>Configure the behavior of encoder custom modes</p>

          </SectionContainer>
        </MenuContainer>
      );
    }
    return null;
  }
}

export default SatisfactionMenu;
