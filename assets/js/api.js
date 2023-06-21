let news = [];
const getLatestNews = async () => {
  let url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=business&page_size=2&lang=ko`
  );
  let header = new Headers({
    "x-api-key": "Xmv7_xOvn8fonj2GcBxgFK2pKvlYDIv9tx7_cR93f7s",
  });
  let response = await fetch(url, { headers: header }); //ajax, http, fetch 등이 있음
  let data = await response.json();
  news = data.articles;

  render();
};

//render()
const render = () => {
  let newsHTML = "";
  newsHTML = news
    .map((news) => {
      return `<div class="row news">
    <div class="col-lg-4">
      <img
        class="news-img-size"
        src="${news.media}"
        alt="bts"
      />
    </div>
    <div class="col-lg-8">
      <h2>코딩알려주는 누나 전격 수업 오픈하다!!!</h2>
      <p>
        코딩알려주는 누나가 자바스크립트 강의를 오픈했따 강의가
        완판이됐다.
      </p>
      <div>KBS * 2023-06-22</div>
    </div>
  </div>`;
    })
    .join("");

  console.log(newsHTML);

  document.getElementById("news-board").innerHTML = newsHTML;
};

//getLatestNews()
getLatestNews();
