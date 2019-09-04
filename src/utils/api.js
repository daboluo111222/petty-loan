import axios from './Axios'
// import { Message } from 'element-ui'
export default {
  getAccountInfo () {
    return axios.post('/api/login/accountInfo', null).then((res) => res.result)
      .then((res) => {
        return res
      })
  }
}
