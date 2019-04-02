import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import fetch from '../utils/ubusFetch'
import getIp from '../utils/getIp'
import './Members.css'
import logo from './psp.png'

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
        method: 'pirania-app',
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
      this.setState({
        valid: true
      }, () => window.location.replace('http://psp.nohost.me'))
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
              <img src={logo} alt="logo Portal sem Porteiras" />
              <h1 className="title">Bem vindo a rede comunitária Portal sem Porteiras</h1>
              <br />
              <p className="text">
                Essa rede é fruto da iniciativa de alguns moradores em parcearia com a coolab. A rede comunitária não visa lucro, os custos da conexão são cotizados entre os usuários para pagar os materiais já adquiridos e técnicos para manutenção e implementação da rede. .
              </p>
              <p className="text">
                Para ter um código você pode se associar a Portal sem Porteiras ou adquirir um voucher. Para mais informações e esclarecimentos pergunte por ai ou entre em contato com 12 991917873
              </p>
              <p className="text">
                Você tem livre acesso ao servidor do bairro mesmo sem voucher. Acesse os Serviços Locais para conhecer a biblioteca virtual e todas as aplicações que estamos desenvolvendo. Colabore com mais conteúdo. Para comunicação interna e gratuita com moradores do bairro instale os aplicativos existentes no nosso repositorios de app .
              </p>
              <h3>Acesse no portal da comunidade em <a href="http://psp.nohost.me">psp.nohost.me</a></h3>
              {!valid &&
                <div>
                  <p className="text">Caso tenha um vale, insira-o no campo abaixo.</p>
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
                  {/* <p>
                    estamos te redirecionando para a internet...
                  </p> */}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}