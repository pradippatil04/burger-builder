import axios from 'axios';

const instance  = axios.create({
  baseURL : 'https://react-my-burger-a49ab-default-rtdb.firebaseio.com/'
});


export default instance;