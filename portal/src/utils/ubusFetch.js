const url = 'http://thisnode.info/ubus'

function parseJSON(response) {
  return response.json()
}


export default ({ session, call, params }) => new Promise((resolve, reject) => {
  const form = {
    id: 99,
    jsonrpc: '2.0',
    method: 'call',
    params:[
      session || '00000000000000000000000000000000',
      call ? 'lime-voucher' : 'session',
      call ? call : 'login',
      params || {},
    ]
  }
  // console.log(form.params)
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(form),
    headers: {
      'Access-Control-Allow-Origin': 'http://thisnode.info'
    },
  })
  .then(parseJSON)
  .then((res) => {
    console.log('Ubus res: ', res)
    if (res && res.result[1]) {
      resolve(res.result[1])
    } else if (res.error) {
      reject(res.error)
    }
  })
  .catch((err) => {
    console.log(err)
  })
  return {}
})