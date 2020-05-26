$(document).ready(() => {
	$('#searchForm').on('submit', (e) => {
		sessionStorage.setItem('searchText', $('#searchText').val());
		window.location = 'results.html';
		e.preventDefault();
	});

	$('#searchForm2').on('submit', (e) => {
		sessionStorage.setItem('searchText', $('#searchText2').val());
		window.location = 'results.html';
		e.preventDefault();
	});
});

var url = 'http://www.omdbapi.com/?apikey=640cf55b&';

function getFavBtnText(id) {
	if (sessionStorage.getItem('favoriteIds') == null) {
		return 'Favorite';
	}

	if (sessionStorage.getItem('favoriteIds').includes(id)) {
		return 'Unfavorite';
	} else {
		return 'Favorite';
	}
}

function getMoviesBySearch() {
	let searchText = sessionStorage.getItem('searchText');
	axios
		.get(url + 's=' + searchText)
		.then((response) => {
			let movies = response.data.Search;
			let output = '';
			$.each(movies, (index, movie) => {
				let favBtnText = getFavBtnText(movie.imdbID);
				console.log(movie.Poster);
				output += `
          <div class="col-md-3">
            <div class="well text-center">
              <img src="${movie.Poster}">
              <h5>${movie.Title}</h5>
							<a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
							<a onclick="movieFavorited('${movie.imdbID}'); window.location.reload();" class="btn btn-primary" href="#">${favBtnText}</a>
            </div>
          </div>
        `;
			});
			$('#movies').html(output);
		})
		.catch((err) => {
			console.log(err);
		});
}

function getMoviesByIds() {
	let favIds = sessionStorage.getItem('favoriteIds');
	if (!favIds == '') {
		favIds = favIds.split(' ');
		let output = '';

		for (let i = 0; i < favIds.length; i++) {
			axios
				.get(url + 'i=' + favIds[i])
				.then((response) => {
					let movie = response.data;
					output += `
          <div class="col-md-3">
            <div class="well text-center">
              <img src="${movie.Poster}">
              <h5>${movie.Title}</h5>
							<a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
							<a onclick="movieFavorited('${movie.imdbID}'); window.location.reload();" class="btn btn-primary" href="#">Unfavorite</a>
            </div>
          </div>
				`;
					$('#movies').html(output);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}
}

function movieFavorited(id) {
	if (sessionStorage.getItem('favoriteIds') === null) {
		sessionStorage.setItem('favoriteIds', '');
	}

	let favIds = sessionStorage.getItem('favoriteIds');

	if (favIds.includes(id)) {
		favIds = favIds.replace(id, '');
	} else {
		favIds += ' ' + id;
	}
	sessionStorage.setItem('favoriteIds', favIds.trim());
	return false;
}

function movieSelected(id) {
	sessionStorage.setItem('movieId', id);
	window.location = 'movie.html';
	return false;
}

function getMovie() {
	let movieId = sessionStorage.getItem('movieId');
	axios
		.get(url + 'i=' + movieId)
		.then((response) => {
			let movie = response.data;
			let favBtnText = getFavBtnText(movie.imdbID);
			let output = `
        <div class="row">
          <div class="col-md-4">
            <img src="${movie.Poster}" class="thumbnail">
          </div>
          <div class="col-md-8">
            <h2>${movie.Title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
              <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
              <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
              <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
							<li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
							<li class="list-group-item"><strong>Plot:</strong> ${movie.Plot}</li>
						</ul>
						<br>
						<p style="float: right;">
						<a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary" >View IMDB</a>
						<a onclick="movieFavorited('${movie.imdbID}'); window.location.reload();" class="btn btn-primary" href="#">${favBtnText}</a>
					<p/>
						</div>
        </div>
      `;

			$('#movie').html(output);
		})
		.catch((err) => {
			console.log(err);
		});
}
