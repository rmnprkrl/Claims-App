import { encodeAddress, decodeAddress } from '@polkadot/keyring';
import * as pUtil from '@polkadot/util';
import React from 'react';
import styled from 'styled-components';

const MainBottom = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 96%;
  background: ;
  border-radius: 12px;
  padding: 2%;
  color: white;
  height: 100%;
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
  @media (max-width: 500px) {
    width: 90% !important;
  }
`;

class InfoBox extends React.Component {

  state = {
    amended: false,
    balData: null,
    noBalance: false,
  }


  balanceCheck = async (e) => {
    let { value } = e.target;
    let amended = false;
    let polkadotAddress, pubKey, index, bal, vestingAmt;

    if (value.length !== 42 && value.length !== 66) {
      return;
    }

    if (!this.props.frozenToken || !this.props.claims) {
      return;
    }

    if (value.length === 42) {
      const logs = await this.props.claims.getPastEvents('Amended', {
        fromBlock: '8167892',
        toBlock: 'latest',
        filter: {
          amendedTo: [value],
        }
      });

      if (logs && logs.length && value !== '0x00b46c2526e227482e2EbB8f4C69E4674d262E75') {
        value = logs[0].returnValues.original;
        amended = logs[0].returnValues.original;
      }

      const vested = await this.props.claims.getPastEvents('Vested', {
        fromBlock: '8167892',
        toBlock: 'latest',
        filter: {
          eth: [value],
        }
      });

      if (vested && vested.length) {
        vestingAmt = vested[0].returnValues.amount;
      }
    }

    // Check whether it is a Ethereum or Polkadot address
    try {
      if (value.length === 42) {
        bal = await this.props.frozenToken.methods.balanceOf(value).call();
      } else {
        bal = await this.props.claims.methods.saleAmounts(value).call();
      }

      if (Number(bal) === 0) {
        this.setState({
          noBalance: true,
        });
        return;
      };

    } catch (error) {
      console.log('error occur in checking balance:', error)
    }

    if (value.length === 42) {
      const claimData = await this.props.claims.methods.claims(value).call();
        index = claimData.index;
        pubKey = claimData.pubKey;
      if (pubKey !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
        polkadotAddress = encodeAddress(pUtil.hexToU8a(pubKey), 0);
      }
    } else {
      pubKey = value
      polkadotAddress = encodeAddress(value, 0);                      
    }

    // Normalization
    bal = Number(bal) / 1000;
    if (vestingAmt) {
      vestingAmt = Number(vestingAmt) / 1000;
    }
    
    this.setState({
      amended,
      balData: {
        bal,
        index: index || null,
        polkadotAddress: polkadotAddress || null,
        pubKey: pubKey || null,
        vested: vestingAmt,
      },
      noBalance: false,
    });
  }

  render() {
    // Collect the data here.
    const { amended, balData, noBalance } = this.state;
    const claimed = balData && balData.pubKey !== '0x0000000000000000000000000000000000000000000000000000000000000000' && balData.bal !== 0;

    return (
      <MainBottom>
        <h1>Verify your claim</h1>
        <h4>Paste an Ethereum or Polkadot public key to check the associated information:</h4>
        <MyInput
          width='500'
          name='balance-check'
          onChange={this.balanceCheck}
        />
        {
          noBalance &&
            <p>No associated DOT balance for this Ethereum account or Polkadot public key.</p>
        }

        {
          amended &&
          <p><b>Amended for:</b>{balData ? amended : ''}</p>
        }
        <p><b>Polkadot address:</b> {(balData && balData.pubKey) ? (claimed ? balData.polkadotAddress : 'Not claimed') : 'None'}</p>
        <p><b>Public key:</b> {(balData && balData.pubKey) ? (claimed ? balData.pubKey : 'Not claimed') : 'None'}</p>
        <p><b>Index:</b> {(balData && balData.index) ? (claimed ? balData.index : 'Not claimed') : 'None'}</p> 
        <p><b>Balance:</b> {balData ? balData.bal : '0'} DOT {balData && balData.vested ? `(${balData.vested} vested)` : ''}</p>
      </MainBottom>
    );
  }
}

export default InfoBox;
