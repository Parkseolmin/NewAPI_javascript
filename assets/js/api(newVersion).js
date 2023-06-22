let news = [];
let page = 1;
let total_pages = 0;

// 메뉴창 클릭 시 이벤트
const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) =>
    getMoveByGenre(event.target.dataset.genreId)
  )
);

// Search button
const searchButton = document.getElementById("search-button");
// Search Input
const searchInput = document.getElementById("search-input");

const API_KEY = "dbf6b842a58af2e2084e854cbdecec3d";
const API_BASE_URL = "https://api.themoviedb.org/3";

// API 호출 함수
const callAPI = async (url, params) => {
  const fullURL = new URL(url);
  const searchParams = new URLSearchParams({
    api_key: API_KEY,
    language: "ko",
    ...params,
  });
  fullURL.search = searchParams.toString();
  const header = new Headers({
    accept: "application/json",
  });
  const response = await fetch(fullURL, { headers: header });
  const data = await response.json();

  total_pages = data.total_pages;
  page = data.page;

  return data.results;
};

// Latest News API 호출
const getLatestNews = async () => {
  const url = `${API_BASE_URL}/discover/movie`;
  const params = {
    page,
  };
  news = await callAPI(url, params);
  render();
};

// Genre API 호출
const getMoveByGenre = async (genreId) => {
  const url = `${API_BASE_URL}/discover/movie`;
  const params = {
    page,
    with_genres: genreId.toString(),
  };
  news = await callAPI(url, params);
  render();
};

// Movies by Keyword API 호출
const getMoviesByKeyword = async () => {
  const keyword = searchInput.value;
  const url = `${API_BASE_URL}/search/movie`;
  const params = {
    page,
    query: keyword,
  };
  news = await callAPI(url, params);
  render();
};

const genreButtons = [...document.querySelectorAll(".menus button")];
genreButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const genreId = button.dataset.genreId;
    getMoveByGenre(genreId);
  });
});

// Render 메소드
const render = () => {
  const newsHTML = news
    .map((item) => {
      return `<div class="row news">
    <div class="col-lg-4">
      <img
        class="news-img-size"
        src="https://image.tmdb.org/t/p/w500/${item.backdrop_path}"
        alt=""
      />
    </div>
    <div class="col-lg-8">
      <h2>${item.original_title}</h2>
      <p>
        ${item.overview}
      </p>
      <div>${item.vote_average} / ${item.vote_count}</div>
    </div>
  </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;

  pagination();
};

const pagination = () => {
  let paginationHTML = "";
  let pageGroup = Math.ceil(page / 10);
  let last = pageGroup * 5;
  let first = last - 4;

  paginationHTML += `<li class="page-item">
    <a class="page-link" href="#" aria-label="Previous" onClick="moveToPage(${
      page - 1
    })">
      <span aria-hidden="true">&lt;</span>
    </a>
  </li>`;

  for (let i = first; i <= last; i++) {
    paginationHTML += `<li class="page-item ${page === i ? "active" : ""}">
      <a class="page-link" href="#" onClick="moveToPage(${i})">${i}</a>
    </li>`;
  }

  paginationHTML += `<li class="page-item">
    <a class="page-link" href="#" aria-label="Next" onClick="moveToPage(${
      page + 1
    })">
      <span aria-hidden="true">&gt;</span>
    </a>
  </li>`;

  paginationHTML += `<li class="page-item">
    <a class="page-link" href="#" onClick="moveToPage(${total_pages})">
      <span aria-hidden="true">&raquo;</span>
    </a>
  </li>`;

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = async (pageNum) => {
  // 1. 이동하고 싶은 페이지를 알아야 함
  page = pageNum;
  // 2. 이동하고 싶은 페이지를 가지고 api를 다시 호출
  await fetchCurrentData();
  // 3. 데이터를 다시 렌더링
  render();
};

//moveToPage 함수를 수정하여 페이지 이동 후에 데이터를 다시 가져오고 렌더링하는 로직을 추가해야 함
const fetchCurrentData = async () => {
  let currentData;
  if (searchInput.value.trim() !== "") {
    currentData = await getMoviesByKeyword();
  } else {
    const activeGenreButton = genreButtons.find((button) =>
      button.classList.contains("active")
    );
    if (activeGenreButton) {
      const genreId = activeGenreButton.dataset.genreId;
      currentData = await getMoveByGenre(genreId);
    } else {
      currentData = await getLatestNews();
    }
  }
  return currentData;
};

// Event Listeners 등록
searchButton.addEventListener("click", getMoviesByKeyword);
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getMoviesByKeyword();
  }
});

// Latest News 호출
getLatestNews();

// API 호출 함수 내부에서 pagination() 함수를 호출하는 부분은 필요가 없으므로 제거합니다.

// callAPI 함수에서 pagination() 함수를 호출하는 대신, getLatestNews 및 getMoveByGenre 함수에서 호출하도록 수정합니다.

// getLatestNews와 getMoveByGenre 함수에서 params 객체의 page 값을 직접 설정하지 않고, page 변수를 사용합니다. 이렇게 하면 페이지 변수를 한 곳에서 관리할 수 있습니다.

// genreButtons 변수를 const 키워드로 선언하고, Array.from을 사용하여 배열로 변환하는 부분을 const genreButtons = [...document.querySelectorAll(".menus button")];로 변경합니다.

// searchInput.value를 직접 비교하는 대신, searchInput.value.trim() !== ""와 같이 공백을 제거한 후 비교하는 것이 안전합니다.
