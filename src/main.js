import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getImg } from './js/pixabay-api';
import { showGLR, showErrorMessage, clearGallery } from './js/render-functions';

export const form = document.querySelector('.form');
const input = document.querySelector('.input-search');
const waitMsg = document.querySelector('.wait-msg');
const loadMoreBtn = document.querySelector('.load-more-btn');

let searchQuery = '';
let page = 1;
const perPage = 40;
let totalHits = 0;

form.addEventListener('submit', handleSubmit);
loadMoreBtn.addEventListener('click', handleLoadMore);

async function handleSubmit(e) {
  e.preventDefault();
  searchQuery = input.value.trim();
  page = 1;

  if (!searchQuery) {
    showErrorToast('Input search string');
    return;
  }

  input.value = '';
  clearGallery();
  hideLoadMoreBtn();
  showLoader();

  try {
    const data = await getImg(searchQuery, page, perPage);
    totalHits = data.totalHits;

    if (!data.hits.length) {
      showErrorMessage();
      return;
    }

    showGLR(data.hits);
    if (page * perPage < totalHits) {
      showLoadMoreBtn();
    }
  } catch (error) {
    console.error(error);
    showErrorToast('Failed to load images. Try again later.');
  } finally {
    hideLoader();
  }
}

async function handleLoadMore() {
  page += 1;
  showLoader();

  try {
    const data = await getImg(searchQuery, page, perPage);
    showGLR(data.hits, true);
    smoothScroll();

    if (page * perPage >= totalHits) {
      hideLoadMoreBtn();
      iziToast.show({
        position: 'topRight',
        message: "We're sorry, but you've reached the end of search results.",
        messageColor: 'white',
        backgroundColor: '#EF4040',
        timeout: 5000,
      });
    }
  } catch (error) {
    console.error(error);
    showErrorToast('Failed to load more images. Try again later.');
  } finally {
    hideLoader();
  }
}

function showLoader() {
  waitMsg.innerHTML = 'Loading... <span class="loader"></span>';
}

function hideLoader() {
  waitMsg.textContent = '';
}

function showLoadMoreBtn() {
  loadMoreBtn.style.display = 'block';
}

function hideLoadMoreBtn() {
  loadMoreBtn.style.display = 'none';
}

function smoothScroll() {
  setTimeout(() => {
    const galleryItem = document.querySelector('.gallery-item');
    if (galleryItem) {
      const cardHeight = galleryItem.getBoundingClientRect().height;
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  }, 300);
}

function showErrorToast(message) {
  iziToast.show({
    backgroundColor: '#EF4040',
    messageColor: '#fff',
    close: true,
    position: 'topRight',
    title: 'Error',
    titleColor: '#fff',
    titleSize: '16px',
    message,
  });
}
