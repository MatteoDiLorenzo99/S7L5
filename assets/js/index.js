const createCardRef = (product) => {
    const cardRef = document.createElement('div');
    cardRef.innerHTML = `
        <div class="card text-white bg-primary mb-5 px-4">
            <h1 class="card-title display-4 mt-2 text-center text-info mt-4">${product.name}</h1>
            <img src="${product.imageUrl}" alt="Product" >
            <div class="card-body p-0">
                <p class="card-text">${product.description}</p>
            </div>
            <div class="d-flex justify-content-end mb-3">
                <a href="./detail.html?eventId=${product._id}&edit=1" class="card-link text-warning fs-5 mr-5">Modifica</a>
                <a href="./detail.html?eventId=${product._id}&edit=0" class="card-link text-success fs-5 mr-5">Scopri di più</a>
            </div>
        </div>
    `;
    return cardRef;
};


const fetchProducts = async () => {
    try {
        let response = await fetch(URL_PRODUCT, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`
            }
        })
        if (response.ok) {
            let products = await response.json();
            return products;
        } else {
            alert('We were able to contact the server, but there was a problem');
            return null;
        }
    } catch (error) {
        alert(error);
    }
};

const cardsSectionRef = document.getElementById('cardsSection');
const spinnerRef = document.getElementsByClassName('spinner-border')[0];
const goUpRef = document.getElementById('goUp');

const URL_PRODUCT = 'https://striveschool-api.herokuapp.com/api/product/';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzM3MWE1MThhZDEyOTAwMTU4NzZiZWMiLCJpYXQiOjE3MzE2NzQ3NjAsImV4cCI6MTczMjg4NDM2MH0.LE9Uf5jIX4e4sR9bIy_ffLTnxQPV3YyXAdRYbPyCqGw';
let products = [];

window.onload = async () => {
    products = await fetchProducts();
    spinnerRef.classList.add('d-none');
    products.forEach(product => {
        let cardRef = createCardRef(product);
        cardsSectionRef.appendChild(cardRef);
    });
    goUpRef.classList.remove('d-none');
}