import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/'
const API_KEY = '39116189-e82791a954216ad4c4e04f473'
axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function getImages(value) {
    try {
      const resp = await axios.get(BASE_URL, {
        params: {
          key: API_KEY,
          q: value,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: 40,
          page: 1,
          }
      })
      //  console.log(resp.data)
      return resp
    }catch (error) {
    console.log(error.massage);
}
}
// getImages()
