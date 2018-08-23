import React, { Component } from 'react'
import Map from './Map'
import './App.css'

export default class App extends Component {
  state = {
    text: '',
  }

  updateInput = (e) => {
    this.setState({ text: e.target.value })
  }

  render() {
    return (
      <div>
        <form method="GET" action="$authaction">
          <input type="hidden" name="tok" value="$tok" />
          <input type="hidden" name="redir" value="$redir" />
          <fieldset>
            <input type="text" name="voucher" id="voucher" placeholder="inserir vale" size="12" className="dest" value={this.state.text} onChange={this.updateInput} />
            <input type="submit" value="OK" />
            <br/>
          </fieldset>
        </form>
        <br />
        <Map />
      </div>
    )
  }
}