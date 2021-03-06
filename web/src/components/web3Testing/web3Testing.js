import React, { Component } from "react";
import Web3 from "web3";
import * as constants from "../../constants";
import Button from "react-bootstrap/Button";

const web3 = new Web3(window.ethereum);

window.ethereum.enable().catch(error => {
    // User denied account access
    console.log(error)
});

const BabCoinContract = new web3.eth.Contract(
  constants.BABCoinABI,
  constants.contractAddress
);

class web3Testing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userAddress: "",
      supply: 0,
      balance: 0
    };
  }

  componentDidMount() {
    web3.eth
      .getAccounts()
      .then(addr => {
        this.setState({ userAddress: addr[0] });
      })
      .then(() => {
        console.log("useraddress", this.state.userAddress);
      });
    BabCoinContract.methods
      .totalSupply()
      .call()
      .then(totalSupply => {
        console.log(totalSupply);
        this.setState({ supply: totalSupply });
      });
  }

  balance = () => {
    BabCoinContract.methods
      .balanceOf(this.state.userAddress)
      .call({ from: this.state.userAddress })
      .then(balanceOf => {
        console.log(balanceOf);
        this.setState({ balance: balanceOf });
      });
  };

  createAnEvent = () => {
      BabCoinContract.methods
          .createEvent(this.state.userAddress, "rsfsh", 20)
          .send({ from: this.state.userAddress });
  }

  rsvpTest = () => {
      BabCoinContract.methods
        .rsvp("rsfsh", 20)
        .send({ from: this.state.userAddress});
  }

  endTestEvent = () => {
      BabCoinContract.methods
          .eventPayout("rsfsh", this.state.userAddress, 20)
          .send({ from: this.state.userAddress});
  }

  render() {
    return (
      <div>
        <h1>
          The total supply is {this.state.supply} and the user address is
          {this.state.userAddress} and the user balance is {this.state.balance}
        </h1>
        <Button onClick={this.balance}>check balance</Button>
        <Button onClick={this.createAnEvent}>createanevent</Button>
        <Button onClick={this.rsvpTest}>testRSVP</Button>
        <Button onClick={this.endTestEvent}>endTestEvent</Button>
      </div>
    );
  }
}

export default web3Testing;
