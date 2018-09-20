const url = 'http://thisnode.info/ubus'

function parseJSON(response) {
  return response.json()
}


export default ({ session, call, login, params }) => new Promise((resolve, reject) => {
  const form = {
    id: 99,
    jsonrpc: '2.0',
    method: 'call',
    params:[
      session || '00000000000000000000000000000000',
      login ? 'session' : 'lime-voucher',
      login ? 'login' : call,
      params || {},
    ]
  }
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(form),
    headers: {
      'Access-Control-Allow-Origin': 'http://thisnode.info'
    },
  })
  .then(parseJSON)
  .then((res) => {
    if (res && res.result[1]) {
      resolve(res.result[1])
    }
  })
  .catch((err) => {
    console.log(err)
  })
  return {}
})