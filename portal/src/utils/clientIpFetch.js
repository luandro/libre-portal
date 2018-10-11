const url = 'http://thisnode.info/cgi-bin/client_ip'

function parseJSON(response) {
  if (response && response.status === 200) return response.json()
  else return { error: true }
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