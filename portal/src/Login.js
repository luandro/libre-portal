import React, { Component } from 'react'
import fetch from './ubusFetch'
export default class AddVoucher extends Component {
  state = {
    password: '',
    admin: null,
  }

  updateInput = (e, field) => {
    this.setState({ [field]: e.target.value })
  }

  handleSubmit = (e) => {
    const { updateSession } = this.props
    e.preventDefault()
    const { password } = this.state
    fetch({
      login: true,
      params: {
        timeout: 5000,
        username: 'root',
        password: password,
      }
    })
    .then(res => {
      if(res.ubus_rpc_session) {
        updateSession({
          session: res.ubus_rpc_session,
          access: res.acls.ubus['lime-voucher']
        })
      }
    })
    .catch(err => console.log(err))
  }

  render() {
    const { password } = this.state
    return (
      <div style={{ width: 300 }}>
        <h3>Login</h3>
        <form onSubmit={this.handleSubmit}>
          <fieldset>
            <input type={'password'} placeholder={'admin password'} size="12" className="dest" value={password} onChange={e => this.updateInput(e, 'password')} />
            <input type="submit" value="OK" />
          </fieldset>
        </form>
      </div>
    )
  }
}