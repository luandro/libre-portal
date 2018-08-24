const url = 'http://10.5.0.1/cgi-bin/client_ip'

function parseJSON(response) {
  return response.json()
}


export default () => new Promise((resolve, reject) => {
  fetch(url)
  .then(parseJSON)
  .then((res) => {
    resolve(res)
  })
  .catch((err) => {
    reject(err)
  })
  return {}
})