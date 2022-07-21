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

function renderSidebarLinks() {
    const list = document.querySelector(".sidebar .list-group");
    const sidebarLinks = ["all products", "laptops", "desktop", "servers", "monitors", "projectors"] //типо из БД получили инфу 

    var newSidebarLinks = sidebarLinks.map((element, ind) => {
        return { id: ind + 1, name: element[0].toUpperCase() + element.substring(1) };
    });

    newSidebarLinks.forEach((elem, ind) => {
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

    filterItems(list);
}

function renderProducts() {
    //...s
}

function filterItems(list) {
    list.addEventListener('click', function(event) {
        if (!event.target.classList.contains("active")) {
            this.querySelector(".active").classList.remove("active");
            event.target.classList.add('active');
            document.querySelector(".active-category").textContent = event.target.textContent;
        }
    });
}

function tooltipInit(condition) {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}


function init() {
    renderNavbarLinks();
    renderSidebarLinks();
    renderProducts();
    mediaQueries();
}

init();