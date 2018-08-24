import React, { Component } from 'react'
import Login from './Login'
import AddVoucher from './AddVoucher'

import './App.css'

export default class App extends Component {
  state={
    session: null,
    access: null,
  }

  updateSession = ({ session, access }) => {
    this.setState({
      session,
      access,
    })
  }

  render() {
    const { session, access } = this.state
    return (
      <div className="App">
        <h1>Pitbull</h1>
        <AddVoucher
          session={session}
          access={access}
        />
        {!session && <Login
          updateSession={this.updateSession}
        />}
      </div>
    )
  }
}