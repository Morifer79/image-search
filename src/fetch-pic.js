import axios from 'axios';
export { fetchPic };

axios.defaults.baseURL = 'https://pixabay.com/api';
const API_KEY = '38349161-181fc6027accb0d90d0649b11';

async function fetchPic(query, page, perPage) {
	const resp = await axios.get(`/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`)
	return resp;
}