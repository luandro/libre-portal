import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import fetch from '../utils/ubusFetch'
import getIp from '../utils/getIp'
import './Members.css'
import logo from './img.jpg'

export default class Members extends Component {
  state = {
    voucher: '',
    user: null,
    macAddress: null,
    valid: null,
  }
  
  getClientInfo = async function () {
    const { session } = this.props
    try {
      const ip = await getIp()
      const clients = await fetch({
        session,
        call: 'get_clients',
      })
      const validMacs = await fetch({
        session,
        call: 'print_valid_macs',
      })
      const myMac = clients.clients.filter(client => client.ip === ip)[0].mac || false
      const valid  = validMacs.macs.filter(mac => mac === myMac).length > 0
      this.setState({
        macAddress: myMac,
        valid,
      })
    } catch (err) { return err }
  }

  authVoucher = () => {
    const { session } = this.props
    const { voucher, macAddress } = this.state
    fetch({
      session,
      call: 'auth_voucher',
      params: {
        voucher,
        mac: macAddress,
      },
    })
    .then(res => {
      console.log('RES', res)
      if (res.result[0] !== 0)
      console.log('SUCCESS ', res)
      this.setState({
        valid: true
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
  }

  componentDidUpdate(prevProps, prevState) {
    // if (this.state.valid) {
    //   setTimeout(() => {
    //     window.location.href = "https://pt.wikipedia.org/wiki/Wikip%C3%A9dia:P%C3%A1gina_principal"
    //   }, 3000);
    // }
  }

  render() {
    const { voucher, valid } = this.state
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
              {!valid &&
                <div>
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
                  <Button variant="contained" color="primary" onClick={this.authVoucher}>
                    Liberar Acesso
                  </Button>
                </div>
              }
              {valid &&
                <div>
                  <Button variant="contained" disabled onClick={this.authVoucher}>
                    Acesso liberado
                  </Button>
                  <p>
                    estamos te redirecionando para a internet...
                  </p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}