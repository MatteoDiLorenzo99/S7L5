// Funzioni di controllo per ogni campo del modulo
const validateField = (fieldRef, errorMessage = '') => {
  const fieldValue = fieldRef.value.trim();

  if (fieldValue) {
      fieldRef.classList.remove('is-invalid');
      fieldRef.classList.add('is-valid');
      return false;
  } else {
      fieldRef.classList.remove('is-valid');
      fieldRef.classList.add('is-invalid');
      if (errorMessage) {
          errorMessage.innerText = 'This field is required!';
      }
      return true;
  }
};

const validatePrice = () => {
  const priceValue = priceFormRef.value.trim();
  priceFormRef.classList.remove('is-valid');
  priceFormRef.classList.add('is-invalid');

  if (!priceValue) {
      priceInvalidRef.innerText = 'Insert Price!';
      return true;
  }

  const parsedPrice = Number(priceValue);
  if (!Number.isInteger(parsedPrice)) {
      priceInvalidRef.innerText = 'Price must be an integer!';
      return true;
  }

  priceFormRef.classList.remove('is-invalid');
  priceFormRef.classList.add('is-valid');
  return false;
};

// Funzione per validare tutti i campi
const isFormValid = () => {
  const nameError = validateField(nameFormRef);
  const descriptionError = validateField(descriptionFormRef);
  const imageUrlError = validateField(imageUrlFormRef);
  const brandError = validateField(brandFormRef);
  const priceError = validatePrice();

  return ![nameError, descriptionError, imageUrlError, brandError, priceError].includes(true);
};

// Funzione per precompilare il modulo in caso di modifica
const populateForm = (productData) => {
  nameFormRef.value = productData.name;
  descriptionFormRef.value = productData.description.trim();
  imageUrlFormRef.value = productData.imageUrl;
  brandFormRef.value = productData.brand;
  priceFormRef.value = productData.price;
};

// Funzione per inviare il prodotto al server
const sendProductToServer = async (newProduct) => {
  try {
      const url = eventId ? `${URL_PRODUCT}${eventId}` : URL_PRODUCT;
      const response = await fetch(url, {
          method: eventId ? 'PUT' : 'POST',
          body: JSON.stringify(newProduct),
          headers: {
              "Authorization": `Bearer ${API_KEY}`,
              'Content-Type': 'application/json',
          },
      });

      if (response.ok) {
          return false;
      } else {
          alert('We were able to contact the server, but there was a problem');
          return true;
      }
  } catch (error) {
      alert(error);
      return true;
  }
};

// Definizione delle variabili globali
const URL_PRODUCT = 'https://striveschool-api.herokuapp.com/api/product/';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzM3MWE1MThhZDEyOTAwMTU4NzZiZWMiLCJpYXQiOjE3MzE2NzQ3NjAsImV4cCI6MTczMjg4NDM2MH0.LE9Uf5jIX4e4sR9bIy_ffLTnxQPV3YyXAdRYbPyCqGw';
const queryParams = new URLSearchParams(window.location.search);
const eventId = queryParams.get('eventId');
const edit = Boolean(parseInt(queryParams.get('edit')));
const product = JSON.parse(localStorage.getItem('curr_product'));

// Selezione degli elementi del DOM
const formRef = document.getElementById('formProduct');
const nameFormRef = document.getElementById('name');
const descriptionFormRef = document.getElementById('description');
const imageUrlFormRef = document.getElementById('imageUrl');
const brandFormRef = document.getElementById('brand');
const priceFormRef = document.getElementById('price');
const priceInvalidRef = document.getElementById('priceInvalid');
const resetFormRef = document.getElementById('resetForm');
const submitBtnRef = document.getElementById('submitBtn');

// Event listener per la submit del form
formRef.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  if (!isFormValid()) {
      return;
  }

  const newProduct = {
      name: nameFormRef.value,
      description: descriptionFormRef.value,
      imageUrl: imageUrlFormRef.value,
      brand: brandFormRef.value,
      price: parseInt(priceFormRef.value),
  };

  const error = await sendProductToServer(newProduct);
  if (!error) {
      formRef.reset();
      window.location.href = "index.html";
  }
});

// Event listener per il reset del form
resetFormRef.addEventListener('click', (event) => {
  event.preventDefault();
  formRef.reset();
});

// Gestione del caricamento della pagina
window.onload = () => {
  formRef.reset();
  if (edit) {
      populateForm(product);
      submitBtnRef.innerText = 'Update Product';
  }
};
