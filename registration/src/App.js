import React, { Component } from 'react'
import RegisterContract from '../build/contracts/Register.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pending: 0,
      completed: 0,
      web3: null,
	    firstName: '',
	    lastName: '',
	    email: ''
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  componentDidMount() {
	document.title = "Register Page";
  }

  handleFirstName = (event) => {
  	this.setState({firstName: event.target.value});
  }

  handleLastName = (event) => {
  	this.setState({lastName: event.target.value});
  }

  handleEmail = (event) => {
  	this.setState({email: event.target.value});
  }

  handleSubmit = (event) => {
    confirm("Welcome " + this.state.firstName +
        " " + this.state.lastName + "\n" +
        "@ " + this.state.email);
    
    const contract = require('truffle-contract')
    const register = contract(RegisterContract)
    register.setProvider(this.state.web3.currentProvider)
    this.forceUpdate();

    // Declaring this for later so we can chain functions on SimpleStorage.
    var registerInstance;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      register.deployed().then((instance) => {
        registerInstance = instance
        this.setState({pending: 1});
        // Register the user
        return registerInstance.register(this.state.firstName, 
                                          this.state.lastName, this.state.email,
                                          {from: accounts[0]})
        .then((result) => {
         // wait for txt:wait

          this.state.web3.eth.getTransactionReceipt(result['tx'],
            (result) => {
                  //console.log(result);
              if (result !== 'undefined') {
                console.log(result);
                this.setState({completed: 1});
              } else {
                console.error("TX failed")
                console.error("result");
                alert ("Transaction Failed");
                this.setState({pending: 0});
              }

            });

        });
      });
    });
    event.preventDefault();
  }

  render() {
    if (this.state.completed) {
      return (
        <div className="App">
          <nav className="navbar pure-menu pure-menu-horizontal">
              <a href="#" className="pure-menu-heading pure-menu-link">Register</a>
          </nav>

          <main className="container">
            <div className="pure-g">
              <div className="pure-u-1-1">
                <h2>You Are Registered</h2>
                <p>{this.state.firstName}</p>
                <p>{this.state.lastName}</p>
                <p>{this.state.email}</p>
              </div>
            </div>
          </main>
        </div>
      );
    }
    if (!this.state.pending) {
      return (
        <div className="App">
          <nav className="navbar pure-menu pure-menu-horizontal">
              <a href="#" className="pure-menu-heading pure-menu-link">Register</a>
          </nav>

          <main className="container">
            <div className="pure-g">
              <div className="pure-u-1-1">
                <h2>Register yourself here</h2>
          <h3>Test 1, 2</h3>
                <p>The stored value is: {this.state.storageValue}</p>
          <form onSubmit={this.handleSubmit}>
          <label>
            First:
            <input type="text" id="first" placeholder="First"  	
            onChange={this.handleFirstName}/>
          </label><br/><br/>
          <label>
            Last:
            <input type="text" id="last" placeholder="Last"  	
            onChange={this.handleLastName}/>
          </label><br/><br/>
          <label>
            Email:
            <input type="text" id="email" placeholder="email"
            onChange={this.handleEmail}/>
          </label><br/><br/>
          <input type="submit" value="Register"/>
          </form>
              </div>
            </div>
          </main>
        </div>
      );
    } else {
      return <div>
        <p>loading...</p>
      </div>
    }
  }
}

export default App
