// const API_KEY = "cb213741fa9662c69add38c5a59c0110";
//

//
// getTrendingMovies();
//



const homeButton = document.querySelector("#homeButton");
const searchBox = document.querySelector(".form-control");
const goToFavouriteButton = document.querySelector("#goto-favourites-button");
const movieCardContainer = document.querySelector(".box")


function showAlert(message) {
  alert(message);
}

let currentMovieStack = [];

function renderList(actionForButton) {
  movieCardContainer.innerHTML = '';

  for (let i = 0; i < currentMovieStack.length; i++) {


    let movieCard = document.createElement('div');
    movieCard.classList.add("movie-card");


    movieCard.innerHTML = `
<div class="card m-2" >
		<img src="${'https://image.tmdb.org/t/p/w500' + currentMovieStack[i].poster_path}" alt="${currentMovieStack[i].title}" height="200" >
			<div class="card-body">
				<h5 class="card-title"><span>${currentMovieStack[i].title}</span></h5>
				<div class="rating-container">
					<img src="./res/rating-icon.png" alt="">
					<span>${currentMovieStack[i].vote_average}</span>
				</div>
				<button id="${currentMovieStack[i].id}" onclick="getMovieInDetail(this)" class="btn btn-primary"> Movie Details </button>

				<button onclick="${actionForButton}(this)" class="add-to-favourite-button text-icon-button btn btn-danger" data-id="${currentMovieStack[i].id}" >

					<span>${actionForButton}</span>
				</button>
			</div>


</div>
		`;
    movieCardContainer.append(movieCard); //appending card to the movie container view

  }
}




// gets trending movies
function getTrandingMovies() {
  const tmdb = fetch("https://api.themoviedb.org/3/trending/movie/day?api_key=cb213741fa9662c69add38c5a59c0110")
    .then((response) => response.json())
    .then((data) => {
      currentMovieStack = data.results;
      renderList("favourite");
    })
    .catch((err) => printError(err));
}

homeButton.addEventListener('click', getTrandingMovies);

getTrandingMovies();
addincurfav();


// search box event listner check for any key press and search the movie according and show on web-page
searchBox.addEventListener('keyup', () => {
  let searchString = searchBox.value;

  if (searchString.length > 0) {
    let searchStringURI = encodeURI(searchString);
    const searchResult = fetch(`https://api.themoviedb.org/3/search/movie?api_key=cb213741fa9662c69add38c5a59c0110&language=en-US&page=1&include_adult=false&query=${searchStringURI}`)
      .then((response) => response.json())
      .then((data) => {
        currentMovieStack = data.results;
        renderList("favourite");
      })
      .catch((err) => printError(err));
  }
})


// function to add movie into favourite section
function favourite(element) {
  let id = element.dataset.id;
  for (let i = 0; i < currentMovieStack.length; i++) {
    if (currentMovieStack[i].id == id) {
      let favouriteMovies = JSON.parse(localStorage.getItem("favouriteMovies"));

      if (favouriteMovies == null) {
        favouriteMovies = [];
      }

      for (let j = 0; j < favouriteMovies.length; j++) {
        if (favouriteMovies[j].id == id) {
          showAlert(currentMovieStack[i].title + " Already added to favourite")
          return;
        }
      }

      favouriteMovies.unshift(currentMovieStack[i]);
      localStorage.setItem("favouriteMovies", JSON.stringify(favouriteMovies));

      addincurfav();
      showAlert(currentMovieStack[i].title + " added to favourite")
      return;
    }
  }
}

function addincurfav() {
  const actionForButton = "remove";
  const favouriteMovies = JSON.parse(localStorage.getItem("favouriteMovies"));

  if (favouriteMovies !== null) {
    const ol = document.querySelector(".offcanvas-body > ol");
    ol.innerHTML = ""
    favouriteMovies.forEach((movie) => {
      const li = document.createElement("li");
      li.innerHTML = `
	      <img src="${'https://image.tmdb.org/t/p/w500' + movie.poster_path}" alt="${movie.title}">
	<button id="${movie.id}" onclick="getMovieInDetail(this)" class="btn btn-primary"> ${movie.title} </button>
	<button onclick="${actionForButton}(this)" class=" text-icon-button btn btn-danger" data-id="${movie.id}" >

		<span>${actionForButton}</span>
	</button>
	    `;
      ol.appendChild(li);
    });
  }
}




// remove movies from favourite section
function remove(element) {
  let id = element.dataset.id;
  let favouriteMovies = JSON.parse(localStorage.getItem("favouriteMovies"));
  let newFavouriteMovies = [];
  for (let i = 0; i < favouriteMovies.length; i++) {
    if (favouriteMovies[i].id == id) {
      continue;
    }
    newFavouriteMovies.push(favouriteMovies[i]);
  }

  localStorage.setItem("favouriteMovies", JSON.stringify(newFavouriteMovies));
  currentMovieStack = newFavouriteMovies;
  // renderList("remove");
  addincurfav();
}



// renders movie details on web-page
function renderMovieInDetail(movie) {
  console.log(movie);
  movieCardContainer.innerHTML = '';

  const movieDetailCard = document.createElement('div');
  movieDetailCard.classList.add('detail-movie-card');
  movieDetailCard.style.textAlign = 'center';

  movieDetailCard.innerHTML = `

<div class="contai" >
<div onclick=getTrandingMovies()>
		<!-- <img src="${'https://image.tmdb.org/t/p/w500' + movie.backdrop_path}" class="detail-movie-background"> -->
		<img src="${'https://image.tmdb.org/t/p/w500' + movie.poster_path}" class="detail-movie-poster">
</div>
		<div class="detail-movie">
			<span><h1>${movie.title}</h1></span>
			<div class="rating">
				stars
				<span>${movie.vote_average}</span>
			</div>
		</div>

	   	<div class="plot">
			 <p>${movie.overview}</p>
			 <p>Release date : ${movie.release_date}</p>
			 <p>runtime : ${movie.runtime} minutes</p>
		 	<p>tagline : ${movie.tagline}</p>
			</div>
		</div>
	`;

  movieCardContainer.append(movieDetailCard);
}


// fetch the defails of of move and send it to renderMovieDetails to display
function getMovieInDetail(element) {

  fetch(`https://api.themoviedb.org/3/movie/${element.getAttribute('id')}?api_key=cb213741fa9662c69add38c5a59c0110&language=en-US`)
    .then((response) => response.json())
    .then((data) => renderMovieInDetail(data))
    .catch((err) => printError(err));

}
