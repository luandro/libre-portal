import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import fetch from '../utils/ubusFetch'
import client from '../utils/clientIpFetch'
import './Members.css'
import logo from './img.jpg'

export default class Members extends Component {
  state = {
    voucher: '',
    user: null,
    macAddress: null,
  }
  
  getClientInfo = () => {
    client()
    .then(res => this.setState({ user: res, macAddress: res.mac }))
  }

  authVoucher = () => {
    const { session } = this.props
    const { voucher, macAddress } = this.state
    console.log(this.state)
    fetch({
      session,
      call: 'auth_voucher',
      params: {
        voucher,
        mac: macAddress,
      },
    })
    .then(res => {
      console.log('SUCCESS ', res)
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
  }

  render() {
    const { voucher } = this.state
    return (
      <div className="bg">
        <div className="bg2">
          <div id="bienvenida-page">
            <div className="box">
              <img src={logo} alt="Rede Moinho" />
              <h1 className="title">Bem vindo a  rede comunitária do Moinho</h1>
              <br />
              <p className="text">Essa rede foi criada e é mantida pela comunidade local. Usamos um sistema de vales para controlar o acesso a internet. Para ter acesso a internet pedimos uma taxa de <strong>R$20,00</strong> por aparelho por mês.
                Os vales de acesso são limitados, para conseguir um ou em caso de dúvidas procure Aridi ou Luandro.
              </p>
              <p className="text">Caso já tenha um vale, insira-o no campo abaixo.</p>
              <TextField
                id="voucher"
                label="Segredo"
                // className={classes.textField}
                value={voucher}
                onChange={e => this.updateInput(e, 'voucher')}
                margin="normal"
              />
              <br />
              <Button variant="contained" color="secondary" onClick={this.authVoucher}>
                Liberar Acesso
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}