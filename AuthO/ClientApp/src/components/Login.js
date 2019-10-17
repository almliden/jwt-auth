import React, { Component } from 'react';

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { style: {border: "1px dotted black", backgroundColor: "lightgray"} };

    this.sendAjaxS = this.sendAjaxS.bind(this);
    this.sendAjaxF = this.sendAjaxF.bind(this);
    this.sendAjaxRestricted = this.sendAjaxRestricted.bind(this);
  }

  sendAjaxS() {
    this.sendAjax('random')
  }
  sendAjaxF() {
    this.sendAjax('wrong password')
  }

  async sendAjaxRestricted() {
    let resp = await this.sendAjaxGet();
    if (resp.status === '200' || resp.status === 200)
      this.setState({style:  {border: "1px dotted black", backgroundColor: "lightgreen"} });
    else
      this.setState({style:  {border: "1px dotted black", backgroundColor: "yellow"} });
    let newElement = `<b>${resp.status}</b>: <span>${resp.result}</span>`
    document.getElementById('require-auth').innerHTML = newElement;
  }

  async sendAjax(password) {
    let url = '/api/login';
    let data = { 'Username': 'admin', 'Password': password };
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow', 
        referrer: 'no-referrer',
        body: JSON.stringify(data),

    });
    let resp = await response.json();
    localStorage.setItem('jwt', resp.accessToken);
    return resp.accessToken;
  };

  async sendAjaxGet() {
    let url = '/api/restricted';
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'bearer ' + localStorage.getItem('jwt')
        },
        redirect: 'follow',
        referrer: 'no-referrer',
    });
    let resp = await response;
    let retVal = {result: '', status: 0};

    if (resp.status >= 200 && resp.status < 300){
        try {
          const reader = response.body.getReader();

          // Step 2: get total length 
          //const contentLength = +response.headers.get('Content-Length');

          // Step 3: read the data
          let receivedLength = 0; // received that many bytes at the moment
          let chunks = []; // array of received binary chunks (comprises the body)
          while(true) {
            const {done, value} = await reader.read();

            if (done) {
              break;
            }

            chunks.push(value);
            receivedLength += value.length;
          }

          // Step 4: concatenate chunks into single Uint8Array
          let chunksAll = new Uint8Array(receivedLength); // (4.1)
          let position = 0;
          for(let chunk of chunks) {
            chunksAll.set(chunk, position); // (4.2)
            position += chunk.length;
          }

          // Step 5: decode into a string
          let result = new TextDecoder("utf-8").decode(chunksAll);


          retVal.result = JSON.parse(result).result;
          retVal.status = resp.status;
        }
        catch{
            retVal.status = 0;
            retVal.result = 'Couldn\'t parse response. ';
        }
    }
    else {
        retVal.status = resp.status;
        switch (resp.status) {
            case(404):
                retVal.result = 'Could not find';
                break;
            case (401):
                retVal.result = 'Unauthorized';
                break;
            default:
                retVal.result = 'Error';
                break;
        }
    }
    return retVal;
  };

  render() {
    return (
      <div>
        <h1>Authorization with JWT</h1>

        <hr />
        
        <h2>Test Authentication</h2>
        <h3>Successful login</h3>
        <p>Login with correct credentials. This generates a token stored in localstorage.</p>
        <button className="btn btn-primary" onClick={this.sendAjaxS}>Login</button>

        <h3>Failed login</h3>
        <p>Login with incorrect credentials. This generates an empty token.</p>
        <button className="btn btn-primary" onClick={this.sendAjaxF}>Login</button>
        
        <hr/>
        
        <h2>Test Authorization</h2>
        <p>Test a request against which also sends the generated token. With a valid token, we could expect a response but with an invalid token the HTTP-statuscode we should receive is an 401: Unauthorized.</p>
        <button className="btn btn-primary" onClick={this.sendAjaxRestricted}>Test</button>

        <h2>Results</h2>
        <br/>
        <div id="require-auth" style={this.state.style}>
          <i>No request has been made</i>
        </div>
      </div>
    );
  }
}
