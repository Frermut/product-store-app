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

function addItemToCard(id, products) {
    products.forEach(product => {
        if(product.id == id) {
            const cartWrapper = document.querySelector(".cart-items");
            const markup = `
                                <li class="list-group-item d-flex align-items-center">
                                    <img src="${product.img}" class="img-fluid image" width="60">
                                    <label class="title" style="flex: 1;text-overflow:ellipsis;overflow:hidden;width:250px;white-space:nowrap;">${product.name}</label>
                                    <span class="cur fw-bold ms-2 ">$</span><label class="me-2 fw-bold price">${product.price.toFixed(2)}</label>
                                    <button class="btn btn-danger float-end">X</button>
                                </li>
                            `;
                cartWrapper.insertAdjacentHTML('beforeend', markup);
        }
    })
}

function checkLogin() {
    const isLogin = JSON.parse(localStorage.getItem('auth'));
    console.log(isLogin);
    if (!isLogin) {
        return false;
    } else {
        return true;
    }
} // проверка регистрационных данных

// function renderNavbarAuth(params) {
//     const list = document.querySelector("#nav-list");
//         const navbarLinksAuth = [{
//             title: "Logout",
//             icon: "bi bi-box-arrow-right",
//             id: 6
//         }];
// }

function eventListenersHandler(products) {

    document.querySelector('#login form')?.addEventListener("submit",async function(event) {
        event.preventDefault();
        const login = document.querySelector('#login form').elements.loginField.value;
        const password = document.querySelector('#login form').elements.passwordField.value;
        const isAuth = await auth(login,password);
        const list = document.querySelector("#nav-list");
        const navbarLinksAuth = [{
            title: "Logout",
            icon: "bi bi-box-arrow-right",
            id: 6
        }];
        if (!isAuth) {
            alert('Данные введены неверно');
        } else {
            //закрывае модальное окно при правильной авторизации
            const loginModal = document.querySelector("#login")?.remove();
            document.querySelector(".modal-backdrop")?.remove();

            document.querySelector("#navbarlink-5").classList.remove('disabled');
            document.querySelector("#navbarlink-5").classList.add('active');
            document.querySelector(".user-login").remove();
            navbarLinksAuth.forEach(function(elem, id) {
                var liMarkup = renderLink(elem, id);
                list.insertAdjacentHTML('beforeend', liMarkup);
            });

            document.querySelector("#navbarlink-6")?.addEventListener("click", function() {
                // let key = localStorage.getItem("auth");
                localStorage.setItem("auth", false);
                document.querySelector("#nav-list").innerHTML = '';
                renderNavbarLinks();
            });

        }
    });

    document.querySelector('.products')?.addEventListener("click", function(event) {
        if(event.target.matches('.btn-buy')){
           const isLogin = checkLogin();
           if (isLogin != true) {
               const modal = new bootstrap.Modal(elemModal);
               const elemModal = document.querySelector('#login');
               modal.show();
           } else {
            const id = event.target.closest(".card").dataset.id;
            addItemToCard(id, products);
           }
        }
        
    });

} // модуль авторизации

async function init() {
    renderNavbarLinks();
    let data = await getDataFromApi();
    renderSidebarLinks(data);
    renderProducts(data.product);
    eventListenersHandler(data.product);
    mediaQueries();
} // функция инициализации


init();

