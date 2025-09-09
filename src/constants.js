
const API_URL = process.env.NODE_ENV === 'production' ?
    (process.env.REACT_APP_BASE_URL || '/api') :
    'http://localhost:4000'

console.log(process.env, "API_URL");

export default API_URL;