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
            icon: "bi bi-house"
        },
        {
            title: "About",
            icon: "bi bi-info-square"
        },
        {
            title: "Specials",
            icon: "bi bi-bookmark"
        },
        {
            title: "Authorization",
            icon: "bi bi-person-fill"
        },
        {
            title: "User Cart",
            icon: "bi bi-bag"
        },
    ]; //типо из БД получили инфу 

    navbarLinks.forEach(function(elem) {
        var title = elem.title;
        var icon = elem.icon;
        var liMarkup = `<li class="nav-item">
                            <a class="nav-link active" 
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
    let categories = await resp.json()
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

async function renderProducts(data) {
    let newProducts = data.product;

    // console.log(newProducts);

    newProducts.forEach(product => {
        let markup = `
        <div class="card mt-2" style="width: 18rem; " data-id="${product.id}" data-category="${product.categoryId}">
            <img class="card-img-top" style="width:220px; height:200px; align-self:center;" src="${product.img}" alt="Card image cap">
                <div class="card-body d-flex flex-column justify-content-between">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <span class="text-muted d-block fs-2 mb-3">$${product.price.toFixed(2)}</span>
                    <a href="#" class="btn btn-danger align-self-start">View</a>
                </div>
        </div>
    `
        document.querySelector(".products").insertAdjacentHTML("beforeend", markup);
    });
}

function filterItems(list, data) {
    list.addEventListener('click', function(event) {
        if (!event.target.classList.contains("active")) {
            this.querySelector(".active").classList.remove("active");
            event.target.classList.add('active');
            document.querySelector(".active-category").textContent = event.target.textContent;
        }
        let products = getProducts(data);
        console.log(products);
    });
}

function tooltipInit(condition) {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}


async function init() {
    renderNavbarLinks();
    let data = await getDataFromApi();
    renderSidebarLinks(data);
    renderProducts(data);
    mediaQueries();
}

init();

//Картинки