export { markupGallery };

const gallery = document.querySelector('.gallery');

function markupGallery(images) {
	const markup = images
		.map(pic => {
			const { largeImageURL, webformatURL, tags, likes, views, comments, downloads } = pic;
			return `
			<a class="photo-link" href="${largeImageURL}">
				<div class="photo-card">
					<img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy" />
					<div class="info">
						<p class="info-item"><b>Likes</b>${likes}</p>
						<p class="info-item"><b>Views</b>${views}</p>
						<p class="info-item"><b>Comments</b>${comments}</p>
						<p class="info-item"><b>Downloads</b>${downloads}</p>
					</div>
				</div>
			</a>`;
		})
		.join('');
	gallery.insertAdjacentHTML('beforeend', markup);
}