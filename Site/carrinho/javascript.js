//Variaveis
let allContainerCart = document.querySelector(".products");
let containerBuyCart = document.querySelector(".card-items");
let priceTotal = document.querySelector(".price-total");
let amountProduct = document.querySelector(".count-product");
let chave = "carrinho";

let buyThings = [];
let totalCard = 0;
let countProduct = 0;

//funções
loadEventListenrs();
function loadEventListenrs() {
  allContainerCart.addEventListener("click", addProduct);

  containerBuyCart.addEventListener("click", deleteProduct);
}

function addProduct(e) {
  e.preventDefault();
  if (e.target.classList.contains("btn-add-cart")) {
    const selectProduct = e.target.parentElement;
    readTheContent(selectProduct);
  }
  let carrinho_texto = JSON.stringify(buyThings);
  console.log("carrinho", carrinho_texto);
  updateLocalStorage();
  console.log(totalCard);
}

function loadCart() {
  if (localStorage.getItem("carrinho") == null) {
    buyThings = [];
  } else {
    let carrinhoStorage = localStorage.getItem(chave);
    buyThings = JSON.parse(carrinhoStorage);
  }

  if (localStorage.getItem("qtd") == null) {
    countProduct = 0;
  } else {
    countProduct = localStorage.getItem("qtd");
  }
  if (localStorage.getItem("valor") == null) {
    totalCard = 0;
  } else {
    totalCard = localStorage.getItem("valor");
  }
  loadHtml();
}

function updateLocalStorage() {
  let carrinho_texto = JSON.stringify(buyThings);
  localStorage.setItem("carrinho", carrinho_texto);
  localStorage.setItem("qtd", countProduct);
  localStorage.setItem("valor", totalCard);
}

function cleanLocalStorageIfEmptyCart() {
  if (buyThings.length < 1) {
    localStorage.removeItem("carrinho");
    localStorage.removeItem("qtd");
    localStorage.removeItem("valor");
  }
}

function deleteProduct(e) {
  if (e.target.classList.contains("delete-product")) {
    const deleteId = e.target.getAttribute("data-id");
    buyThings.forEach((value) => {
      if (value.id == deleteId) {
        let priceReduce = parseFloat(value.price) * parseFloat(value.amount);
        console.log(priceReduce, totalCard);
        totalCard = totalCard - priceReduce;
        totalCard = totalCard.toFixed(2);
      }
    });
    buyThings = buyThings.filter((product) => product.id !== deleteId);
    countProduct--;
    updateLocalStorage();
    cleanLocalStorageIfEmptyCart();
  }
  loadHtml();
}

function readTheContent(product) {
  const infoProduct = {
    image: product.querySelector("div img").src,
    title: product.querySelector(".title").textContent,
    price: product.querySelector("div p span").textContent,
    id: product.querySelector("a").getAttribute("data-id"),
    amount: 1,
  };

  totalCard = parseFloat(totalCard) + parseFloat(infoProduct.price);
  totalCard = totalCard.toFixed(2);

  const exist = buyThings.some((product) => product.id === infoProduct.id);
  if (exist) {
    const pro = buyThings.map((product) => {
      if (product.id === infoProduct.id) {
        product.amount++;
        return product;
      } else {
        return product;
      }
    });
    buyThings = [...pro];
  } else {
    buyThings = [...buyThings, infoProduct];
    countProduct++;
  }
  loadHtml();
  console.log(infoProduct);
}

function loadHtml() {
  clearHtml();
  if (buyThings.length != 0) {
    buyThings.forEach((product) => {
      const { image, title, price, amount, id } = product;
      const row = document.createElement("div");
      row.classList.add("item");
      row.innerHTML = `
            <img src="${image}" alt="">
            <div class="item-content">
                <h5>${title}</h5>
                <h5 class="cart-price">${price}$</h5>
                <h6>Amount: ${amount}</h6>
            </div>
            <span class="delete-product" data-id="${id}">X</span>
        `;

      containerBuyCart.appendChild(row);

      priceTotal.innerHTML = totalCard;

      amountProduct.innerHTML = countProduct;
    });
  } else {
    priceTotal.innerHTML = totalCard;

    amountProduct.innerHTML = countProduct;
  }
}
function clearHtml() {
  containerBuyCart.innerHTML = "";
}
