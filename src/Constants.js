const dev = {
  url: {
    API_URL: 'http://localhost:8080/api/',
    API_URL_GET_TRANSACTIONS: 'http://localhost:8080/api/get_transactions/',
    API_URL_ADD_TRANSACTION: 'http://localhost:8080/api/add_transaction',
    API_URL_EDIT_TRANSACTION: 'http://localhost:8080/api/edit_transaction'
  }
}

const prod = {
  url: {
    API_URL: 'https://moneytrackerbackend.herokuapp.com.com/api/',
    API_URL_GET_TRANSACTIONS: 'https://moneytrackerbackend.herokuapp.com/api/get_transactions/',
    API_URL_ADD_TRANSACTION: 'https://moneytrackerbackend.herokuapp.com/api/add_transaction',
    API_URL_EDIT_TRANSACTION: 'https://moneytrackerbackend.herokuapp.com.com/api/edit_transaction'
  }
}

export const url = process.env.NODE_ENV === `development` ? dev.url : prod.url;