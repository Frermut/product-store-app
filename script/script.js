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
}

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
                var title = elem.title;
                var icon = elem.icon;
                var liMarkup = `<li class="nav-item" ${elem.id == 4 ? `data-bs-toggle="modal" data-bs-target="#login"` : ''}>
                            <a class="nav-link ${elem.id == 5 ? `disabled` : `active`}" 
                            aria-current="page" 
                            href="#" 
                            data-bs-toggle="tooltip" 
                            data-bs-placement="bottom" 
                            title="${title}">
                                <i class="${icon}"></i>
                                <span class="d-none d-lg-inline">${title}</span>
                            </a>
                        </li>`; //Markup - название для переменных с кодом HTML
        list.insertAdjacentHTML('beforeend', liMarkup);
    }); // и тут обработали RowData(сырую информацию)
}

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
}

async function getSidebarLinks() {
    let resp = await fetch("http://www.demo-it-park.site/getApi/?categories=get");
    let categories = await resp.json();
    let newCategories = categories.map((element, ind) => {
        return { id: ind + 1, name: element[0].toUpperCase() + element.substring(1) };
    });
    return newCategories;
}

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
}

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
}

function renderProduct(product) {
    let markup = `
        <div class="card mt-2" style="width: 18rem; " data-id="${product.id}" data-category="${product.categoryId}">
            <img class="card-img-top" style="width:220px; height:200px; align-self:center;" src="${product.img}" alt="Card image cap">
                <div class="card-body d-flex flex-column justify-content-between">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <span class="text-muted d-block fs-2 mb-3">$${product.price.toFixed(2)}</span>
                    <a href="#" class="btn btn-danger align-self-start">Buy</a>
                </div>
        </div>
    `;
    document.querySelector(".products").insertAdjacentHTML("beforeend", markup);

}

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
}

function tooltipInit(condition) {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

function login() {
const login = document.querySelector('#login form').elements.login.value;
const password = document.querySelector('#login form').elements.password.value;
console.log(login, password);
}

async function init() {
    renderNavbarLinks();
    let data = await getDataFromApi();
    renderSidebarLinks(data);
    renderProducts(data.product);
    document.querySelector('#login form').addEventListener("submit", login);
    mediaQueries();
}

init();

//Картинки