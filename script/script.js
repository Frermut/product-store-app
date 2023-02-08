function mediaQueries() {
    const mediaQuery = window.matchMedia("(max-width: 992px)");
    if (mediaQuery.matches) {
        tooltipInit();
    } else {
        var navLinks = document.querySelectorAll(".nav-link");
        navLinks.forEach(element => {
            element.removeAttribute("title");
        });
    }
} //отвечает за title взависимости от устройства

function renderNavbarLinks() {
    const list = document.querySelector("#nav-list");
    const navbarLinks = [{
            title: "Home",
            icon: "bi bi-house",
            id: 1
        },
        {
            title: "About",
            icon: "bi bi-info-square",
            id: 2
        },
        {
            title: "Specials",
            icon: "bi bi-bookmark",
            id: 3
        },
        {
            title: "Authorization",
            icon: "bi bi-person-fill",
            id: 4
        },
        {
            title: "User Cart",
            icon: "bi bi-bag",
            id: 5
        },
    ]; //типо из БД получили инфу 

    navbarLinks.forEach(function(elem, id) {
        var liMarkup = renderLink(elem, id);
        list.insertAdjacentHTML('beforeend', liMarkup);
    }); // и тут обработали RowData(сырую информацию)
} // рендерит все иконки 

function renderLink(elem, id) {
    var title = elem.title;
    var icon = elem.icon;
    return `<li class="nav-item ${elem.id == 4 ? 'user-login' : ''}" ${elem.id == 4 ? `data-bs-toggle="modal" data-bs-target="#login"` : ''}>
                <a id="navbarlink-${elem.id}" class="nav-link ${elem.id == 5 ? `disabled user-card` : `active user-card`} " 
                ${elem.id == 5 ? `data-bs-toggle="modal" data-bs-target="#userCart"` : `data-bs-toggle="tooltip"`}
                aria-current="page" 
                href="#" 
                data-bs-placement="bottom" 
                title="${title}">
                    <i class="${icon}"></i>
                    <span class="d-none d-lg-inline">${title}</span>
                </a>
            </li>`; //Markup - название для переменных с кодом HTML
} // мокап одной иконки

async function getSidebarLinks() {
    let resp = await fetch("http://www.demo-it-park.site/getApi/?categories=get");
    let categories = await resp.json();
    let newCategories = categories.map((element, ind) => {
        return { id: ind + 1, name: element[0].toUpperCase() + element.substring(1) };
    });
    return newCategories;
} //запрашивает названия категорий для левого сайдбара

function renderSidebarLinks(data) {
    const list = document.querySelector(".sidebar .list-group");
    let sidebarLinks = data.category;
    console.log(sidebarLinks);
    sidebarLinks.forEach((elem, ind) => {
        var id = elem.id;
        var name = elem.name;

        var activeClass = "";
        if (ind == 0) {
            activeClass = 'active';
            document.querySelector(".active-category").textContent = name;
        }
        var linkMarkup = `<button 
                        data-id="${id}"
                        type="button" 
                        class="border-0 list-group-item 
                        list-group-item-action ${activeClass}">${name}</button>`;
        list.insertAdjacentHTML('beforeend', linkMarkup);
    });

    filterItems(list, data);
} // рендерит левый сайдбар

async function getDataFromApi() {
    let category = await getSidebarLinks();
    let data = {
            category,
        }
        // fetch('http://www.demo-it-park.site/getApi/?products=get').then(response => response.json()).then(data => console.log(data));
    let resp = await fetch("http://www.demo-it-park.site/getApi/?products=get");
    let products = await resp.json();
    let categories = data.category;

    let newProducts = products.map((product, id) => {
        let result = categories.find((category, cat_ind) => {
            return category.name == product.category;
        });
        return {
            id: id + 1,
            name: product.name,
            category: product.category,
            categoryId: result.id,
            description: product.description,
            price: product.price,
            img: product.img,
        }

    });
    data.product = newProducts;
    console.log(data);

    return data;
} // получает данные товаров

async function renderProducts(products, catId = 1) {
    if (catId == 1) {
        products.forEach(product => {
            renderProduct(product);
        });
    } else {
        document.querySelector(".products").innerHTML = '';
        products.forEach(product => {
            if (product.categoryId == catId) {
                renderProduct(product);
            }
        });
    }
} // рендерит товары

function renderProduct(product) {
    let markup = `
        <div class="card mt-2" style="width: 18rem; " data-id="${product.id}" data-category="${product.categoryId}">
            <img class="card-img-top" style="width:220px; height:200px; align-self:center;" src="${product.img}" alt="Card image cap">
                <div class="card-body d-flex flex-column justify-content-between">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <span class="text-muted d-block fs-2 mb-3">$${product.price.toFixed(2)}</span>
                    <a href="#" class="btn-buy btn btn-danger align-self-start">Buy</a>
                </div>
        </div>
    `;
    document.querySelector(".products").insertAdjacentHTML("beforeend", markup);

} // мокап одного товара

function filterItems(list, data) {
    list.addEventListener('click', function(event) {
        if (!event.target.classList.contains("active")) {
            this.querySelector(".active").classList.remove("active");
            event.target.classList.add('active');
            document.querySelector(".active-category").textContent = event.target.textContent;
        }
        renderProducts(data.product, event.target.dataset.id)
            // let products = getProducts(data);
            // console.log(products);
    });
} // сортирует товары по категориям 

function tooltipInit(condition) {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
} // инструменты для фреймворка

async function auth(login,password) {
    const user = {login,password};
    const resp = await fetch("http://www.demo-it-park.site/getApi/?auth=post", {
        method: 'POST',
        body: JSON.stringify(user),
    });
    const data = await resp.json();
    localStorage.setItem('auth',data);
    console.log(login, password, data);
    if (data != true) {
        return false;
    } else {
        return true;
    }  
} // проверка пользователя

function calcCart() {
    let cartProductsPrices = document.querySelectorAll(".price");
    let total = document.querySelector("#total");
    let sum = 0;
    cartProductsPrices.forEach(element => {
        sum += parseFloat(element.textContent);
    });
    //console.log(sum);
    total.textContent = sum.toFixed(2);
} // Высчитывает итоговую сумму (Total)

function isAnyProductsInCart() {
    if (!document.querySelector(".product-cart")) {
        // document.querySelector(".cart-items").innerHTML = "<i>Cart empty.<i>";
        document.querySelector(".cart-items").innerHTML = "<i>Cart empty.<i>";
    }
} // проверка на наличие продукта в корзине

function addItemToCard(id, products, needLS = false) {
    products.forEach(product => {
        if(product.id == id) {
            if (needLS == true) {
                setProductInLs(product); //по флагу проверяем когда сохранять
            }
            const cartWrapper = document.querySelector(".cart-items");
            const markup = `
                                <li data-id="${product.id}" class="list-group-item d-flex align-items-center product-cart">
                                    <img src="${product.img}" class="img-fluid image" width="60">
                                    <label class="title" style="flex: 1;text-overflow:ellipsis;overflow:hidden;width:250px;white-space:nowrap;">${product.name}</label>
                                    <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                                    <input id="quantity" min="0"  value="1" type="number" class="form-control form-control-sm" />
                                    </div>
                                    <span class="cur fw-bold ms-2 ">$</span><label class="me-2 fw-bold price">${product.price.toFixed(2)}</label>
                                    <button class="btn btn-danger float-end delete-item">X</button>
                                </li>
                            `;
                cartWrapper.insertAdjacentHTML('beforeend', markup);
        }
    })
} // добавляет товар в корзину

function checkLogin() {
    const isLogin = JSON.parse(localStorage.getItem('auth'));
    console.log(isLogin);
    if (!isLogin) {
        return false;
    } else {
        return true;
    }
} // проверка регистрационных данных

function renderNavbarAuth() {
        const list = document.querySelector("#nav-list");
        const navbarLinksAuth = [{
            title: "Logout",
            icon: "bi bi-box-arrow-right",
            id: 6
        }];
        document.querySelector(".user-login")?.remove();
        navbarLinksAuth.forEach(function(elem, id) {
            var liMarkup = renderLink(elem, id);
            list.insertAdjacentHTML('beforeend', liMarkup);
        });
        return list, navbarLinksAuth;
} // рендерит иконку выйти

function notify(text) {
    const markup = `<div class="alert alert-success message" role="alert"style="position: fixed;
    top: 3%;
    left: 1%;
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    z-index:10 !important;">
                    ${text}
                    </div>`;
    document.body.insertAdjacentHTML('afterbegin', markup);
    setTimeout(() => {
        document.querySelector(".message").remove();
    }, 2000);
} // уведомление

function setProductInLs(product) {
    // console.log(product);
    let cart = JSON.parse(localStorage.getItem("cart")); // [], null
    if (cart == null) {
        cart = [];
    } 
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
}

function deleteItemFromLs(id) {
    let cart = JSON.parse(localStorage.getItem("cart"));
    // console.log(cart);
 
    for (let i = 0; i < cart.length; i++) {
        if (id == cart[i].id) {
            cart.splice(i,1); //удаляем только пришедший id и перезаписываем оставшиеся товары в новый массив
            break;
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

function isUser(products) {
    const isAuth = checkLogin();
    if (isAuth) {
        //вызываем корзину
        renderNavbarAuth();
        document.querySelector("#navbarlink-5").classList.remove('disabled');
        document.querySelector("#navbarlink-5").classList.add('active');
        // запрос на получение корзины из LS
        const userCart = JSON.parse(localStorage.getItem('cart'));
        
        if (userCart) {
            userCart.forEach(element => {
                addItemToCard(element.id, products);            
                calcCart();
            });
        }

        
     
    }
}

function eventListenersHandler(products) {

    document.querySelector('#login form')?.addEventListener("submit",async function(event) {
        event.preventDefault();
        const login = document.querySelector('#login form').elements.loginField.value;
        const password = document.querySelector('#login form').elements.passwordField.value;
        const isAuth = await auth(login,password);
        
        if (!isAuth) {
            alert('Данные введены неверно');
        } else {
            //закрывае модальное окно при правильной авторизации
            const loginModal = document.querySelector("#login")?.remove();
            document.querySelector(".modal-backdrop")?.remove();
            document.querySelector("body").style.overflowY = "auto";

            document.querySelector("#navbarlink-5").classList.remove('disabled');
            document.querySelector("#navbarlink-5").classList.add('active');
            document.querySelector(".user-login").remove();

            notify('Вы успешно авторизировались!');

            renderNavbarAuth();

            document.querySelector("#navbarlink-6")?.addEventListener("click", function() {
                // let key = localStorage.getItem("auth");
                localStorage.setItem("auth", false);
                document.querySelector("#nav-list").innerHTML = '';
                renderNavbarLinks();
                notify("Выполнен выход из профиля!");
            });
           
            const userCart = JSON.parse(localStorage.getItem('cart'));
            if (userCart) {
                userCart.forEach(element => {
                    addItemToCard(element.id, products);
                });
            }
            calcCart();
        }

    }); // авторизация

    document.querySelector("#navbarlink-5").addEventListener("click", isAnyProductsInCart);

    document.querySelector('.products')?.addEventListener("click", function(event) {
        if(event.target.matches('.btn-buy')){
           const isLogin = checkLogin();
           if (isLogin != true) {
               const elemModal = document.querySelector('#login');
               const modal = new bootstrap.Modal(elemModal);
               modal.show();
           } else {
            document.querySelector(".cart-items i")?.remove();
            const id = event.target.closest(".card").dataset.id;
            
            addItemToCard(id, products, true);
            calcCart();
           }
        }

        
    }); // работа с модалкой

    document.querySelector(".cart-items").addEventListener("click", function(event) {
        event.preventDefault();
        if (event.target.matches(".delete-item")) {
            let id = parseInt(event.target.parentElement.dataset.id);
            console.log(id);
            deleteItemFromLs(id);
            event.target.parentElement.remove();
            calcCart();
            isAnyProductsInCart();
        }
    }); // удаление через кнопку Х

    document.querySelector("#clear-all").addEventListener("click", function(event) {
        event.preventDefault();
        if(event.target) {
            let products = document.querySelectorAll(".product-cart");
            products.forEach(product => {
                product.remove();
            });
            localStorage.removeItem("cart");
            isAnyProductsInCart();
            calcCart();
            notify("Выполнена очистка корзины!");
        }
        
    }); // удаление через кнопку Clear


} // модуль авторизации + работа с корзиной

async function init() {
    renderNavbarLinks();
    let data = await getDataFromApi();
    renderSidebarLinks(data);
    renderProducts(data.product);
    isUser(data.product);
    eventListenersHandler(data.product);
    mediaQueries();
} // функция инициализации

init();

