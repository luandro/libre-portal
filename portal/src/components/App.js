import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from "react-router-dom";
import Drawer from './Drawer'
import AppBar from './AppBar'
// import Login from './Login'
// import AddVoucher from './AddVoucher'
import Map from './Map'
import Members from './Members'
import About from './About'
import Admin from './Admin'


import './App.css'

export default class App extends Component {
  state={
    session: null,
    access: null,
    drawer: false,
  }

  updateSession = ({ session, access }) => {
    this.setState({
      session,
      access,
    })
  }

  toggleDrawer = () => {
    this.setState({
      drawer: !this.state.drawer,
    })
  }

  render() {
    const { session, access, drawer } = this.state
    return (
      <Router>
        <div className="App">
          <AppBar toggleDrawer={this.toggleDrawer} />
          <Drawer toggleDrawer={this.toggleDrawer} open={drawer}/>
          <Route exact path="/" component={Map} />
          <Route exact path="/sobre" component={About} />
          <Route
            path="/membros"
            render={props => <Members {...props} session={session} access={access} />}
          />
          <Route
            path="/admin"
            render={props => <Admin {...props} session={session} access={access} updateSession={this.updateSession} />}
          />
          {/* <AddVoucher
            session={session}
            access={access}
          />
          {!session && <Login
            updateSession={this.updateSession}
          />} */}
        </div>
      </Router>
    )
  }
}