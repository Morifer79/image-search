import { fetchPic } from "./fetch-pic";
import { markupGallery } from "./markup-gallery";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

let SimpleLightbox = new SimpleLightbox('.gallery a')

const searchForm = document.querySelector('.search-form').addEventListener('submit', handleSearchForm)
const gallery = document.querySelector('.gallery');
const guard = document.querySelector('.js-guard');

let query = '';
let page = 1;
const perPage = 40;

const options = {
		root: null,
		rootMargin: '300px',
		threshold: 0,
}

const observer = new IntersectionObserver(handlerPagination, options);

function handlerPagination(entries, observer) {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			page += 1;
			fetchPic(query, page, perPage)
				.then(({data}) => {
					markupGallery(data.hits);
					if (gallery.children.length >= data.totalHits) {
						Notify.failure("We're sorry, but you've reached the end of search results.");
						observer.unobserve(entry.target);
					}
				})
				.catch(err => console.error(err))
		}
	});
}

function handleSearchForm(e) {
	e.preventDefault();
	query = e.currentTarget.searchQuery.value.trim();
	gallery.innerHTML = '';

	if (query === '') {
		Notify.failure("The search string cannot be empty. Please specify your search query.");
		return;
	}

	fetchPic(query, page, perPage)
		.then(({data}) => {
			if (data.totalHits === 0) {
				Notify.failure('Sorry, there are no images matching your search query. Please try again.');
			} else {
				Notify.success(`Hooray! We found ${data.totalHits} images.`);
				markupGallery(data.hits);
				SimpleLightbox = new SimpleLightbox('.gallery a').refresh();
				pageScroll();

				if (gallery.children.length < data.totalHits) {
					observer.observe(guard);
				}
			}
		})
		.catch(err => console.error(err))
}

// кнопка автопрокрутки вверх
const goTopBtn = document.querySelector(".go-top");

window.addEventListener("scroll", trackScroll);

goTopBtn.addEventListener("click", goTop);

function trackScroll() {
	const scrolled = window.pageYOffset;
	const coords = document.documentElement.clientHeight;
	if (scrolled > coords) {
		goTopBtn.classList.add("go-top--show");
	} else {
		goTopBtn.classList.remove("go-top--show");
	}
}
trackScroll();

function goTop() {
	if (window.pageYOffset > 0) {
		window.scrollBy(0, -75);
		setTimeout(goTop, 0);
	}
}
goTop();

// плавный скролл
function pageScroll() {
	const {height: cardHeight} = gallery.firstElementChild;
	gallery.getBoundingClientRect();
	window.scrollBy({top: cardHeight * 2, behavior: "smooth"});
}