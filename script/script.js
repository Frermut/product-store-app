function mediaQueries() {
    const mediaQuery = window.matchMedia("(min-width: 992px)");
    mediaQuery.addEventListener("change", function() {
        if (mediaQuery.matches) {
            var a = document.querySelectorAll(".nav-item .nav-link").title;
            console.log(a);
        }
    });

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

function tooltipInit() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

function init() {
    renderNavbarLinks();
    mediaQueries();
    tooltipInit();
}

init();