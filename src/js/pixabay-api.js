import axios from 'axios';

const baseUrl = 'https://pixabay.com';
const endPoint = '/api';
const API_KEY = '48962354-d02229266f1321f72919e6f30';

export async function getImg(searchName, page, perPage) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: searchName,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page,
    per_page: perPage,
  });

  const url = `${baseUrl}${endPoint}?${params}`;

  const response = await axios.get(url);
  return response.data;
}
