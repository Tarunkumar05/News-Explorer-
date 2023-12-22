const API_KEY = "81dfc3fa45f64d9fb1f8078273ab2c02";
const url = "https://newsapi.org/v2/everything?q=";

const articlesPerPage = 9;
let currentPage = 1;
let totalResults = 0;

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}


async function fetchNews(query) {
    const actualQuery = query || 'world';
    const res = await fetch(`${url}${actualQuery}&apiKey=${API_KEY}&pageSize=${articlesPerPage}&page=${currentPage}`);
    const data = await res.json();

    totalResults = data.totalResults;
    
    bindData(data.articles)
    updatePagination();
}

function bindData(articles) {
    const cardsContainer =document.getElementById("cards-container")
    const newsCardTemplate = document.getElementById("template-news-card") 

    cardsContainer.innerHTML = '';

    articles.forEach(article => {
        if(!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article)
        cardsContainer.appendChild(cardClone);

    })
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta"
    });

    newsSource.innerHTML = `${article.source.name} • ${date} `

    cardClone.firstElementChild.addEventListener("click", () =>{
        window.open(article.url, "_blank");
    })

}

let currentSelectedNav = null;
function onNavItemClick(id) {
    currentPage = 1;
    fetchNews(id);
    const navItem = document.getElementById(id);
    currentSelectedNav?.classList.remove('active');
    currentSelectedNav = navItem;
    currentSelectedNav.classList.add('active');
}

const searchText = document.getElementById("search-text");
const searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", () => {
    currentPage = 1;
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    currentSelectedNav?.classList.remove('active');
    currentSelectedNav = null;
});

function onPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchNews(currentSelectedNav?.id || searchText.value);
        scrollToTop();
    }
}

function onNextPage() {
    const totalPages = Math.ceil(totalResults / articlesPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        fetchNews(currentSelectedNav?.id || searchText.value);
        scrollToTop();
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function updatePagination() {
    const totalPages = Math.ceil(totalResults / articlesPerPage);
    const pageNumbers = document.getElementById("page-numbers");

    // Display current page and total pages
    pageNumbers.textContent = `${currentPage} / ${totalPages}`;

    // Disable/enable prev and next buttons based on current page
    const prevPageButton = document.getElementById("prev-page");
    const nextPageButton = document.getElementById("next-page");

    prevPageButton.disabled = currentPage === 1 || totalResults === 0;
    nextPageButton.disabled = currentPage === totalPages || totalResults === 0;
}
