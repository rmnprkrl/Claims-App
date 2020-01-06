import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faThumbsUp, faUnlink } from '@fortawesome/free-solid-svg-icons';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import * as pUtil from '@polkadot/util';
import bs58 from 'bs58';
import React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { BrowserRouter as Router, Route } from "react-router-dom";
import styled from 'styled-components';

import Web3 from 'web3';

// Assets
import Polkadot from './assets/polkadot_logo.png';
import PolkadotLight from './assets/logo-polkadot-light.svg';

// Components
import InfoBox from './components/Info';

// Smart Contracts
import Claims from './build/contracts/Claims.json';
import FrozenToken from './build/contracts/FrozenToken.json';

const check = (address) => {
  const decoded = pUtil.bufferToU8a(bs58.decode(address));
  
  return decoded[0] === 0;
}

const Navbar = styled.div`
  width: 80vw;
  height: 60px;
  background: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: white;
  z-index: 100;
  padding-left: 8%;
  padding-right: 12%;
`;

const NavButton = styled.button`
border-radius: 20px;
background: #E6007A;
width: 180px;
border: none;
color: white;
padding: 10px;
padding-left: 4px;
padding-right: 4px;
font-size: 20px;
font-weight: 500;
align-self: center;
:hover {
  cursor: pointer;
}
`;

const Main = styled.div`
  width: 100%;
  padding: 0%;
  display: flex;
  flex-direction: column;
  padding-top: 0;
  margin-top: 0%;
  @media (max-width: 750px) {
    flex-direction: column;
    padding: 0;
    justify-content: center;
    align-items: center;
  }
`;

const MainHeadline = styled.h1`
  color: white;
  display: flex;
  height: 100%;
  align-items: center;
  font-weight: 100;
  font-size: 48px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: ${props => props.alignment == 'row'? 'row': 'column'};
  align-items: ${props => props.centered? 'center' : 'flex-start'};
  width: 100%;
  height: ${props => props.height}px;
  margin-right: 0%;
  background: ${props => props.bg};
  color: ${props => props.color == 'white'? 'white': 'black'};
  padding: 0%;
  @media (max-width: 750px) {
    width: 90%;
    margin-bottom: 3%;
  }
`;

const HeaderBox = styled.div`
  width: 45%;
  background: ;
  margin-left: 10%;
  margin-top: 2%;
  margin-bottom: 10%;
`;

const Text = styled.h2`
  font-weight: 100;
  font-size: 34px;
`;

const Line = styled.div`
  height: 2px;
  background: grey;
  width: 80%;
  margin-left: 10%;
  margin:-right: 10%;
`;

const DotButton = styled.button`
  border-radius: 25px;
  background: #E6007A;
  width: 300px;
  border: none;
  color: white;
  padding: 10px;
  padding-left: 40px;
  padding-right: 40px;
  font-size: 24px;
  font-weight: 300;
  align-self: center;
  :hover {
    cursor: pointer;
  }
`;

const Column = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding-left: ${props => props.paddingHoriz? props.paddingHoriz: 0}%;
  padding-right: ${props => props.paddingHoriz? props.paddingHoriz: 0}%;
  padding-top: ${props => props.paddingVert? props.paddingVert: 0}%;
  padding-bottom: ${props => props.paddingVert? props.paddingVert: 0}%;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding-left: ${props => props.paddingHoriz? props.paddingHoriz: 0}%;
  padding-right: ${props => props.paddingHoriz? props.paddingHoriz: 0}%;
  padding-top: ${props => props.paddingVert? props.paddingVert: 0}%;
  padding-bottom: ${props => props.paddingVert? props.paddingVert: 0}%;
  flex-direction: row;
`;

const InternalLeft = styled.div`
  height: 100%;
  width: 40%;
  display: flex;
  flex-direction: column;
`;

const InternalRight = styled.div`
  height: 100%;
  width: 40%;
`;

const InnerSupportLeft = styled.div`
  width: 50%;
`;


const InnerSupportRight = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SupportButton = styled(DotButton)`
  background: rgba(255,255,255,0.5);
  color: black;
  margin-left: 80px;
  margin-top: 50px;
`;

const MainRight = styled.div`
  margin: auto;
  width: 70%;
`;

const SucceedIcon = styled(FontAwesomeIcon)`
  color: ${props => Boolean(props.status) ? 'green' : 'red'};
`;

const MyInput = styled.input`
  width: ${props => props.width}px !important;
  border-color: black;
  border-radius: 10px;
  border-width: 2px;
  padding: 2px;
  padding-left: 3px;
  font-size: 13px;
  margin-bottom: 16px;
  @media (max-width: 750px) {
    width: 90% !important;
  }
`;

const MySelect = styled.select`
  border-color: black;
  border-radius: 10px;
  border-width: 2px;
  padding: 1px;
  padding-left: 2px;
  background: white;
  width: 80%;
  margin-top: 10px;
`;

const TextareaButton = styled.button`
  background: black;
  color: white;
  border-color: black;
  :hover {
    cursor: pointer;
  }
  @media (max-width: 750px) {
    margin-left: 80%;
  }
`;

const DisabledText = styled.div`
  background: #EBEBE4;
  font-size: 12px;
  color: #545454;
  border-style: solid;
  border-color: silver;
  border-width: 0.25px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 25px;
  overflow-x: hidden;
  position: relative;
`;

const DisabledButton = styled.button`
  position: absolute;
  right: 0;
  :hover {
    cursor: pointer;
    background: #fff;
  }
`;


class App extends React.Component {

  state = {
    claims: null,
    correctAmendment: null,
    defaultAccount: null,
    frozenToken: null,
    myCrypto: false,
    pubKey: null,
    showAmend: false,
    status: null,
    web3: null,
  }

  componentDidMount = async () => {
    const w3 = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/v3/7121204aac9a45dcb9c2cc825fb85159"));

    this.setState({
      web3: w3,
    });
  }

  initializeContracts = async (web3) => {
    const frozenToken = new web3.eth.Contract(FrozenToken, "0xebfbe0f24e6dfaff47b05a77b9c81ec9890542c3");
    const claims = new web3.eth.Contract(Claims, "0x7aeefaab36a205a9d3c3c511db74d080997fbb63");
  
    this.setState({
      claims,
      frozenToken,
    });
  }

  inputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'valid-check') {
      let notice, pubKey, status;
      
      try {
        // Check if its a properly encoding Kusama address.
        if (!check(value)) {
          try {
            pubKey = pUtil.u8aToHex(decodeAddress(value));
            // It's either a Kusama, Substrate or other.
            // pubKey = 'This is not a Polkadot address.'
            notice = true;
            status = true;
          } catch (e) {
            pubKey = 'invalid';
            notice = false;
            status = false;
          }
        } else {
          try {
            pubKey = pUtil.u8aToHex(decodeAddress(value, false,  0));
            notice = false;
            status = true;
          } catch (e) {
            pubKey = 'invalid';
            notice = false;
            status = false;
          }
        }
      } catch (e) {
        pubKey = 'invalid';
        notice = false;
        status = false;
      }

      this.setState({
        notice,
        pubKey,
        status,
      })
    }

    this.setState({
      [name]: value,
    });
  }

  handleSelect = (e) => {
    const { value } = e.target;
    if (value === 'MyCrypto') {
      this.setState({
        myCrypto: true,
      });
    }
  }

  render() {
    if (this.state.web3 !== null && !this.state.claims && !this.state.frozenToken) {
      this.initializeContracts(this.state.web3);
    }

    return (
      <Router>
        <div>
          <Navbar>
            <img src={Polkadot} width='180px' height='90px'/>
            <NavButton>Start Claims</NavButton>
          </Navbar>
          <Route
            path='/'
            render={() => (
              <>
                <Main>
                  <Section height={'300'} bg='#DB0072' centered={true}>
                    <MainHeadline>Welcome to DOT Claims</MainHeadline>
                  </Section>
                  <Section height={500} bg='white'>
                    <HeaderBox>
                      <Text>This App will walk you through the process of claiming dots. In order to do so, you need to have an allocation of dots.</Text>
                    </HeaderBox>
                    {/* <h1>Placeholder</h1> */}
                    <DotButton>Start</DotButton>
                  </Section>
                  <Section height={300} bg='silver'>
                    <Column paddingHoriz={10} paddingVert={5}>
                      <h1>Create a wallet</h1>
                      <Row>
                        <InternalLeft>
                          <p>
                            You will need to generate a Polkadot account to claim DOT.
                            There are a few ways you can create one.
                          </p>
                          <p>
                            For most users, we recommend using the Polkadot UI since it
                            will allow you to store your encrypted keystore locally.
                          </p>
                        </InternalLeft>
                        <InternalRight>
                          <p>
                            Another option you may consider using is the subkey command
                            line utility, which will allow you to take extra steps to protect
                            the security of your key. 
                           </p>
                           <p> 
                            Additionally, two other options include
                            the Enzyme browser extension wallet and the Polkawallet
                            mobile wallet, although these require an extra step to generate
                            Polkadot addresses.
                          </p>
                        </InternalRight>
                      </Row>
                    </Column>
                  </Section>
                  <Section height={600} bg='white'>
                    Here goes the instructions
                  </Section>
                  <Section height={500} bg='silver'>
                    <Column paddingHoriz={10} paddingVert={5}>
                      <h1>DOTs Claim</h1>
                      <Row>
                        <InternalLeft>
                          <p>
                            If you participated in the DOT sale and have received your DOT
                            indicator tokens, you can claim the corresponding amount of
                            KSM.
                          </p>
                          <p>
                            Make sure to use your original Ethereum key during this
                            process.
                          </p>
                        </InternalLeft>
                        <InternalRight>
                          <p>
                            If you don’t have a Polkadot address, you will
                            need to generate a Polkadot address.
                          </p>
                          <p>
                            Go to Create a Wallet.
                          </p>
                        </InternalRight>
                      </Row>
                      <Row>
                        <Column>
                          <h4>How will you claim?</h4>
                          <MySelect onChange={this.handleSelect} defaultValue="">
                            <option value="">Choose your method to claim</option>
                            <option value="MyCrypto">On Ethereum (before genesis)</option>
                            <option value="On-chain" disabled>On Polkadot (after genesis)</option>
                          </MySelect>
                        </Column>
                      </Row>
                    </Column>
                  </Section>
                  <Section height={600} bg='white'>
                    <MainRight>
                    {this.state.myCrypto && 
                        <div>
                          <h4>Claims contract:</h4>
                          <DisabledText>
                          0x7aeefaab36a205a9d3c3c511db74d080997fbb63
                            <CopyToClipboard text="0x7aeefaab36a205a9d3c3c511db74d080997fbb63">
                              <DisabledButton>
                                <FontAwesomeIcon icon={faClipboard}/>
                              </DisabledButton>
                            </CopyToClipboard>
                          </DisabledText>
                          <h4>ABI:</h4>
                          <div style={{ position: 'relative' }}>
                            <textarea style={{width: '100%', height: '100px', resize: 'none'}} disabled defaultValue={JSON.stringify(Claims)}></textarea>
                            <CopyToClipboard text={JSON.stringify(Claims)}>
                              <TextareaButton>click to copy</TextareaButton>
                            </CopyToClipboard>
                          </div>
                          <h4>What is your Polkadot address? (<a href="#" target="_blank">Please check here</a>)</h4>
                          <div>
                            <MyInput
                              width='450'
                              name='valid-check'
                              onChange={this.inputChange}
                            />
                            {' '}<SucceedIcon icon={Boolean(this.state.status) ? faThumbsUp : faUnlink} status={this.state.status}/>
                          </div>
                          {
                            this.state.notice &&
                              <p style ={{ color: 'red' }}>This is NOT a Polkadot address. Your Polkadot address will be: {encodeAddress(pUtil.hexToU8a(this.state.pubKey), 0)}</p>
                          }
                          <p>Public Key:</p>
                          <DisabledText>
                            {this.state.pubKey || ''}
                            <CopyToClipboard text={this.state.pubKey || ''}>
                              <DisabledButton>
                                <FontAwesomeIcon icon={faClipboard}/>
                              </DisabledButton>
                            </CopyToClipboard>
                          </DisabledText>
                          <br />
                          <p>You will need to <a href="https://github.com/MyCryptoHQ/MyCrypto/releases" target="_blank">download</a> and use MyCrypto locally to make this transaction.</p>
                          <a href="https://guide.kusama.network/en/latest/start/dot-holders/" target="_blank">Instructions for DOT holders.</a><br/>
                        </div>
                    }
                    </MainRight>
                  </Section>
                  <Section height={'400'} bg='#DB0072'>
                    <InfoBox claims={this.state.claims || null} frozenToken={this.state.frozenToken || null} />
                  </Section>
                  <Section height={400} bg='silver' alignment='row'>
                    <Column paddingHoriz={10} paddingVert={5}>
                      <h1>Third Party Claims Processes</h1>
                      <Row>
                      <InnerSupportLeft>
                        <p>
                          We do not recommend using a third party app or process to claim or acquire your DOT.
                        </p>
                        <p>
                          Claiming using a third-party process can lead to the loss ofyour allocation, therefore we cannot recommend using any
                          third party apps to do so. Manually specifying your transaction
                          data, as specified in our claims process, is the only way to be
                          certain you will receive your allocation.
                        </p>
                      </InnerSupportLeft>
                      <InnerSupportRight>
                        <p>Need help? Join the Claims Support chat.</p>
                        <SupportButton>Support Chat</SupportButton>
                      </InnerSupportRight>
                      </Row>
                    </Column>
                  </Section>
                  <Section height={'420'} bg='#172026' color='white'>
                    <Row paddingHoriz={10} paddingVert={2} style={{ width: '80%' }}>
                      <Column> 
                        <h5>General</h5>
                        <a href="">About</a>
                        <a href="">FAQ</a>
                        <a href="">Contact</a>
                        <a href="">Build on Polkadot</a>
                        <a href="">Grants and Bounties</a>
                        <a href="">Careers</a>
                      </Column>
                      <Column>
                        <h5>Technology</h5>
                        <a href="">Technology</a>
                        <a href="">Token</a>
                        <a href="">Telemetry</a>
                        <a href="">Substrate</a>
                        <a href="">Whitepaper</a>
                      </Column>
                      <Column>
                        <h5>Community</h5>
                        <a href="">Community</a>
                        <a href="">Documentation</a>
                        <a href="">Blog</a>
                        <a href="">GitHub</a>
                        <a href="">Riot Chat</a>
                        <a href="">Medium</a>
                        <a href="">Reddit</a>
                        <a href="">Telegram</a>
                      </Column>
                      <Column>
                        Icons!
                      </Column>
                    </Row>
                    <Line/>
                    <Row paddingHoriz={10} paddingVert={2} style={{ alignItems: 'flex-end', }}>
                      <img width='120' src={PolkadotLight}/>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      © 2020
                      &nbsp;
                      <a href="">Polkadot</a>&nbsp;|
                      &nbsp;
                      <a href="">Impressum</a>&nbsp;|
                      &nbsp;
                      <a href="">Disclaimer</a>&nbsp;|
                      &nbsp;
                      <a href="">Privacy</a>&nbsp;|
                      &nbsp;
                      <a href="">Testnet Disclaimer</a>&nbsp;|
                      &nbsp;
                      <a href="">Memorandum  </a>
                    </Row>
                  </Section>
                </Main>
              </>
            )}/>
        </div>
      </Router>
    );
  }
}

export default App;
