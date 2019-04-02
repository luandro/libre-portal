import React, { Component } from 'react'
import fetch from '../utils/ubusFetch'
import client from '../utils/getIp'
import Login from './Login'

export default class Admin extends Component {
  state = {
    clients: [],
    macs: [],
    user: null,
    key: '',
    secret: '',
    days: '',
    auth: '',
    macAddress: '',
  }

  getClients = () => {
    const { session } = this.props
    fetch({
      session,
      call: 'get_clients',
      method: 'pirania-app',
    })
    .then(res => this.setState({
      clients: res.clients
    }))
    .catch(err => console.log(err))
  }

  getAllowedMacs = () => {
    const { session } = this.props
    fetch({
      session,
      call: 'print_valid_macs'
    })
    .then(res => this.setState({
      macs: res.macs
    }))
    .catch(err => console.log(err))
  }
  
  getClientInfo = () => {
    client()
    .then(res => this.setState({ user: res, macAddress: res.mac }))
  }

  authVoucher = () => {
    const { session } = this.props
    const { auth, macAddress } = this.state
    fetch({
      session,
      call: 'auth_voucher',
      params: {
        voucher: auth,
        mac: macAddress,
      },
    })
    .then(res => {
      this.getAllowedMacs()
      this.setState({
        auth: '',
      })
    })
    .catch(err => console.log(err))
  }

  addVoucher = (e) => {
    e.preventDefault()
    const { session } = this.props
    const { key, secret, days } = this.state
    const numberDays = parseInt(days, 0)
    const daysInMs = numberDays * 86400000
    const epoc = new Date().getTime() + daysInMs
    fetch({
      session,
      call: 'add_voucher',
      params: {
        epoc,
        key,
        upload: 10,
        download: 10,
        amountofmacsallowed: 3,
        secret,
      },
    })
    .then(res => {
      this.setState({
        key: '',
        secret: '',
        days: '',
      })
    })
    .catch(err => console.log(err))
  }

  updateInput = (e, field) => {
    this.setState({
      [field]: e.target.value
    })
  }

  componentDidMount() {
    this.getClientInfo()
    this.getClients()
    this.getAllowedMacs()
  }

  render() {
    const { clients, macs, user, key, secret, days, auth, macAddress } = this.state
    const { access } = this.props
    return (
      <div>
        <h3>grant access a device</h3>
        <select onChange={e => this.updateInput(e, 'macAddress')} value={macAddress}>
          {clients.map(client => {
            // console.log('CLIENT', client.mac, user)
            const vouched = macs.filter(mac => mac === client.mac)[0]
            const me = (client.mac === user.mac)
            return <option
              key={client.mac}
              value={client.mac}
            >
                { me ? '*' : null } { client.station } { vouched ? '✅' : null }
            </option>
          })}
        </select>
        <input type='text' placeholder='voucher' size="12" value={auth} onChange={e => this.updateInput(e, 'auth')} />
        <button onClick={this.authVoucher}>Grant Access</button>
        {/* <button onClick={this.authVoucher}>Revoke Access</button> */}
        {(access && (access[3] === '*')) && <div>
          <h2>Admin</h2>
          <h3>generate new voucher</h3>
          <form onSubmit={this.addVoucher}>
            <fieldset>
              <input type='text' placeholder='voucher key' size="12" value={key} onChange={e => this.updateInput(e, 'key')} />
              <input type='text' placeholder='voucher secret' size="12" value={secret} onChange={e => this.updateInput(e, 'secret')} />
              <input type='text' placeholder='1' size="2" value={days} onChange={e => this.updateInput(e, 'days')} />
              <input type='submit' value="Create" />
            </fieldset>
          </form>
        </div>}
        <Login updateSession={this.props.updateSession} />
      </div>
    )
  }
}