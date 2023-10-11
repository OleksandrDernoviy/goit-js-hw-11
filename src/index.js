
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import { getImages } from './pixby-api'
import './sass/styles.css'


const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
   captionDelay: 250,
    close: false,
});
const formEl = document.querySelector('#search-form')
const searchQueryEl = document.querySelector('[searchQuery]')
const galleryEl = document.querySelector('.gallery')
const loadMoreBtnEl = document.querySelector('.load-more')
const perPage = 40
let page = 1



function renderMarkup(images) {
  const creatMarkup = images
    .map(
      ({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
    return `<div class="photo-card">
  <a href="${largeImageURL}">
  <img class="img-gallery" src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item"><b>Likes</b>${likes}</p>
    <p class="info-item"><b>Views</b>${views}</p>
    <p class="info-item"><b>Comments</b>${comments}</p>
    <p class="info-item"><b>Downloads</b>${downloads}</p>
  </div>
</div>`
      })
    .join('');
 
  galleryEl.insertAdjacentHTML('beforeend', creatMarkup);
}


formEl.addEventListener('submit', onSubmit)

 async function onSubmit(evt) {
  evt.preventDefault()
     let querry = evt.currentTarget.searchQuery.value.trim()
     page = 1
     galeryDel()


  if (querry === '') {
    loadMoreBtnEl.classList.remove('show-btn')
    return Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  try {
    const gallerySearch = await getImages(querry, page)
        let numberPages = gallerySearch.data.totalHits
    console.log(gallerySearch);
    
    if (gallerySearch.data.hits.length === 0) {
         galeryDel()
         Notiflix.Notify.failure(
         'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (numberPages >= 1 && numberPages < 40) {
      loadMoreBtnEl.classList.remove('show-btn')
      
         Notiflix.Notify.success(`Hooray! We found ${numberPages} image.`)
      
    } else if (numberPages > 40) {
         loadMoreBtnEl.classList.add('show-btn')
         Notiflix.Notify.success(`Hooray! We found ${numberPages} image.`);
    }
         renderMarkup(gallerySearch.data.hits)

    lightbox.refresh()

  } catch (error) {
    console.log(error)
         Notiflix.Notify.failure(
         'Sorry, there are no images matching your search query. Please try again.'
    )
  }

  lightbox.refresh()
}

loadMoreBtnEl.addEventListener('click', onClick)
async function onClick() {
  page += 1;
  let querry = formEl.elements.searchQuery.value.trim();
    try {
      const gallerySearch = await getImages(querry, page);
      let showPages = gallerySearch.data.totalHits / perPage;

       if (showPages <= page) {
        loadMoreBtnEl.classList.remove('show-btn')
         Notiflix.Notify.failure(
            "We're sorry, but you've reached the end of search results."
       );
    }

    renderMarkup(gallerySearch.data.hits);
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  lightbox.refresh();
  

}

function galeryDel() {
    galleryEl.innerHTML = '';
    page = 1;
    loadMoreBtnEl.classList.remove('show-btn')
}




