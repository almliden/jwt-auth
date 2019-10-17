import React, { Component } from 'react';

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { currentCount: 0 };
    this.incrementCounter = this.incrementCounter.bind(this);
    this.sendAjaxS = this.sendAjaxS.bind(this);
    this.sendAjaxF = this.sendAjaxF.bind(this);
    this.sendAjaxRestricted = this.sendAjaxRestricted.bind(this);
  }
  sendAjaxS() {
    this.sendAjax('random')
  }
  sendAjaxF() {
    this.sendAjax('wrong')
  }
  async sendAjaxRestricted() {
    let resp = this.sendAjaxGet();
    let newElement = `<span>Status: ${resp.status}. Value: ${resp.json}</span>`
    document.getElementById('require-auth').innerHTML = newElement;
  }

  async sendAjax(password) {
    let url = '/api/login';
    let data = { 'Username': 'admin', 'Password': password };
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache',
        // credentials: 'same-origin', // include, *same-origin, omit  
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error 
        referrer: 'no-referrer', // no-referrer, *client 
        body: JSON.stringify(data), // body data type must match "Content-Type" header

    });
    let resp = await response.json();
    localStorage.setItem('jwt', resp.accessToken);
    return resp.accessToken;
  };

  async sendAjaxGet() {
    let url = '/api/restricted';
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache',
        // credentials: 'same-origin', // include, *same-origin, omit   
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'bearer ' + localStorage.getItem('jwt')
          // 'Content-Type': 'application/x-www-form-urlencoded',
        }, 
        redirect: 'follow', // manual, *follow, error 
        referrer: 'no-referrer', // no-referrer, *client   
        //body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    let resp = await response.json();
    return resp.result || 'error';
  };

  incrementCounter() {
    this.setState({
      currentCount: this.state.currentCount + 1
    });
  }
  //<p aria-live="polite">Current count: <strong>{this.state.currentCount}</strong></p>

  render() {
    return (
      <div>
        <h1>OAuth2.0</h1>

        <hr />
        <h2>Test login</h2>
        <h3>Login success</h3>
        <button className="btn btn-primary" onClick={this.sendAjaxS}>Login</button>

        <h3>Login fail</h3>
        <button className="btn btn-primary" onClick={this.sendAjaxF}>Login</button>
        <hr/>
        <h2>Test authentication</h2>
        <button className="btn btn-primary" onClick={this.sendAjaxRestricted}>Test</button>

        <div id="require-auth">
          <i>No request has been made</i>
        </div>
      </div>
    );
  }
}
