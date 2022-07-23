class Product {
    constructor(title, img, price) {
        this.title = title;
        this.img = img;
        this.price = price;
    }
}

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
    const sidebarLinks = ["all products", "Laptops & PC", "Smart Phones", "Other"] //типо из БД получили инфу 

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
    return newSidebarLinks;
}

function renderProducts(categories) {
    const data = `[{
            "name": " Acer Aspire 5 Slim Laptop",
            "description": "RAM: 4GB, CPU Model Manufacturer: AMD Ryzen 3 3200U, CPU Speed: 3.5GHz, Hard disk size: 128GB, Screen size: 15.6 inches, RAM type: DDR4 SDRAM, Operating System: Windows 10 Small",
            "price": 349.99,
            "countInStock": 8,
            "company": "Acer",
            "category": "Laptops & PC",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Laptops & PC/Acer Aspire 5 Slim Laptop.jpg"
        },
        {
            "name": " Acer Aspire 5 Slim Laptop",
            "description": "RAM: 8GB, CPU Model Manufacturer: 10th Gen Intel Core i5-10210U, CPU Speed: 4.2GHz, Hard disk size: 256GB, Screen size: 15.6 inches, RAM type: DDR4 SDRAM, Operating System: Windows 10 Home",
            "price": 579.99,
            "countInStock": 0,
            "company": "Acer",
            "category": "Laptops & PC",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Laptops & PC/Acer Aspire 5 Slim Laptop ryzen 3.jpg"
        },
        {
            "name": "ASUS VivoBook Thin and Light Laptop",
            "description": "RAM: 8GB, CPU Model Manufacturer: Intel i3-1005G1 CPU, CPU Speed: 3.4GHz, Screen size: 15.6 inches, RAM type: DDR4 SDRAM, Operating System: Windows 10 Small",
            "price": 399.99,
            "countInStock": 13,
            "company": "ASUS",
            "category": "Laptops & PC",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Laptops & PC/ASUS VivoBook Thin and Light Laptop.jpg"
        },

        {
            "name": "ASUS VivoBook L203MA Ultra-Thin Laptop",
            "description": "RAM: 4GB, CPU Model Manufacturer: Intel Celeron N4000, CPU Speed: 2.6GHz, Hard disk size: 64GB, Screen size: 11.6 inches, RAM type: DDR4 SDRAM, Operating System: Windows 10 Home",
            "price": 264.99,
            "countInStock": 13,
            "company": "ASUS",
            "category": "Laptops & PC",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Laptops & PC/ASUS VivoBook L203MA Ultra-Thin Laptop.jpg"
        },
        {
            "name": "Acer Aspire Z24-890-UA91 AIO Desktop",
            "description": "RAM: 12GB, CPU Model Manufacturer: 9th Gen Intel Core i5-9400T, CPU Speed: 3.4GHz, Hard disk size: 512GB, Screen size: 23.8 inches, Operating System: Windows 10 Home",
            "price": 798.99,
            "countInStock": 8000,
            "company": "Acer",
            "category": "Laptops & PC",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Laptops & PC/Acer Aspire Z24-890-UA91 AIO Desktop.jpg"
        },
        {
            "name": "HP Full HD IPS-WLED Touch Screen",
            "description": "RAM: 8GB, CPU Model Manufacturer: AMD Ryzen 3 3200UT, CPU Speed: 9.0GHz, Hard disk size: 1TB, Screen size: 23.8 inches, Operating System: Windows 10 Home",
            "price": 649.99,
            "countInStock": 5,
            "company": "HP",
            "category": "Laptops & PC",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Laptops & PC/HP Full HD IPS-WLED Touch Screen.jpg"
        },
        {
            "name": "HP Spectre Pro x360 G2 Convertible Touchscreen",
            "description": "RAM: 8GB, CPU Model Manufacturer: Intel core i7-6600U, CPU Speed: 2.6GHz, Hard disk size: 512GB SSD, Screen size: 13.3 inches, RAM type:  LPDDR3-1600, Operating System: Windows 10 Pro",
            "price": 739.0,
            "countInStock": 16,
            "company": "HP",
            "category": "Laptops & PC",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Laptops & PC/HP Spectre Pro x360 G2 Convertible Touchscreen.jpg"
        },
        {
            "name": "Lenovo Flex 2-in-1 Laptop,Full HD IPS Touchscreen",
            "description": "RAM: 12GB, CPU Model Manufacturer: 8th Gen Intel Core i7-8550U, CPU Speed: 4.0GHz, Hard disk size: 256GB SSD, Screen size: 14 inches, RAM type: DDR4, Operating System: Windows 10",
            "price": 879.0,
            "countInStock": 7,
            "company": "Lenovo",
            "category": "Laptops & PC",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Laptops & PC/Lenovo Flex 2-in-1 Laptop,Full HD IPS Touchscreen.jpg"
        },
        {
            "name": "Acer Spin 3 Convertible Laptop, Full HD IPS Touch",
            "description": "RAM: 16GB, CPU Model Manufacturer: 8th Gen Intel Core i7-8565U, CPU Speed: 4.6GHz, Hard disk size: 512GB SSD, Screen size: 14 inches, RAM type: DDR4 SDRAM, Operating System: Windows 10 Home",
            "price": 795.99,
            "countInStock": 9,
            "company": "Acer",
            "category": "Laptops & PC",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Laptops & PC/Acer Spin 3 Convertible Laptop, Full HD IPS Touch.jpg"
        },
        {
            "name": "Dell XPS 9370 13.3in 4K UHD Touchscreen Laptop PC",
            "description": "RAM: 16GB, CPU Model Manufacturer: Intel Core i7-8550U, CPU Speed: 4.0GHz, Hard disk size: 512GB SSD, Screen size: 13.3 inches, RAM type: DDR4 SDRAM, Operating System: Windows 10 Pro",
            "price": 1149.66,
            "countInStock": 8,
            "company": "Dell",
            "category": "Laptops & PC",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Laptops & PC/Dell XPS 9370 13.3in 4K UHD Touchscreen Laptop PC.jpg"
        },
        {
            "name": "Acer Nitro 5 Gaming Laptop",
            "description": "RAM: 8GB, CPU Model Manufacturer: 10th-generation Intel Core i3 processor, CPU Speed: 4.1GHz, Hard disk size: NVMe SSD, Screen size: 15.6 inches, RAM type: DDR4 SDRAM, Operating System: Windows 10 Home",
            "price": 663.62,
            "countInStock": 2,
            "company": "Apple",
            "category": "Laptops & PC",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Laptops & PC/Acer Nitro 5 Gaming Laptop.jpg"
        },
        {
            "name": "Razer Blade 15 Gaming Laptop",
            "description": "RAM: 16GB, Intel Core i7-9750H 6 Core, NVIDIA GeForce GTX 1660 Ti, CPU Speed: 4.5GHz, Hard disk size: 256GB SSD, Screen size: 15.6 inches, RAM type: DDR4 SDRAM, Operating System: Windows 10",
            "price": 1099.99,
            "countInStock": 4,
            "company": "Razer",
            "category": "Laptops & PC",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Laptops & PC/Razer Blade 15 Gaming Laptop.jpg"
        },
        {
            "name": "Dell XPS 13 9370, TouchScreen InfinityEdge 4K",
            "description": "RAM: 16GB, Intel Quad-Core i7-8550U, CPU Speed: 1.8GHz, Hard disk size: 512GB PCIe SSD, Screen size: 13.3 inches, RAM type: LPDDR3, Operating System: Windows 10",
            "price": 1149.66,
            "countInStock": 11,
            "company": "Dell",
            "category": "Laptops & PC",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Laptops & PC/Lenovo Flex 2-in-1 Laptop,Full HD IPS Touchscreen.jpg"
        },
        {
            "name": "Apple MacBook Air with Retina Display",
            "description": "RAM: 8GB, CPU Model Manufacturer: 10th-generation Intel Core i3 processor, CPU Speed: 1.1GHz, Hard disk size: 256GB SSD, Screen size: 13 inches, RAM type: DDR4 SDRAM, Operating System: Mac OS X 10.0 Cheetah",
            "price": 899.99,
            "countInStock": 5,
            "company": "Apple",
            "category": "Laptops & PC",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Laptops & PC/Apple MacBook Air with Retina Display.jpg"
        },
        {
            "name": "Apple iPhone 11 Pro Max",
            "description": "Display: 6.5-inch Super Retina XDR display Camera: Triple 12MP Ultra Wide, Wide, and Telephoto cameras Front Camera: 12MP TrueDepth camera Face/Touch: ID Face ID Chip: A13 Bionic chip with third-generation Neural Engine Wireless Charging: Yes (works with Qi chargers)",
            "price": 1099.0,
            "countInStock": 5,
            "company": "Apple",
            "category": "Smart Phones",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Smart Phones/Apple iPhone 11 Pro Max.jpg"
        },
        {
            "name": "Apple iPhone SE",
            "description": "Display: 4.7-inch Retina HD display Camera: 12MP camera Front Camera: 7MP FaceTime HD camera Face/Touch: ID Touch ID Chip: A13 Bionic chip with Neural Engine Wireless Charging: Yes (works with Qi chargers)",
            "price": 399.0,
            "countInStock": 12,
            "company": "Apple",
            "category": "Smart Phones",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Smart Phones/Apple iPhone SE.jpg"
        },
        {
            "name": "Apple iPhone 11",
            "description": "Display: 6.1-inch Liquid Retina HD display Camera: Dual 12MP Ultra Wide and Wide cameras Front Camera: 7MP TrueDepth camera Face/Touch: ID Face ID Chip: A13 Bionic chip with Third-generation Neural Engine Wireless Charging: Yes (works with Qi chargers)",
            "price": 699.0,
            "countInStock": 4,
            "company": "Apple",
            "category": "Smart Phones",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Smart Phones/Apple iPhone 11.jpg"
        },
        {
            "name": "Apple iPhone XR",
            "description": "Display: 6.1-inch Liquid Retina HD display Camera: 12MP camera Front Camera: 7MP TrueDepth camera Face/Touch: ID Face ID Chip: A12 Bionic chip with next-generation Neural Engine Wireless Charging: Yes (works with Qi chargers)",
            "price": 599.0,
            "countInStock": 9,
            "company": "Apple",
            "category": "Smart Phones",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Smart Phones/Apple iPhone XR.jpg"
        },
        {
            "name": "Apple iPhone XS",
            "description": "Display: 5.8-inch Super Retina HD display/Camera: Dual 12MP wide-angle and telephoto cameras/Front Camera: 7MP TrueDepth camera/Face/Touch ID: Face ID/Chip: A12 Bionic chip with next-generation Neural Engine//Wireless Charging: Yes (works with Qi chargers) ",
            "price": 899.0,
            "countInStock": 8,
            "company": "Apple",
            "category": "Smart Phones",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Smart Phones/Apple iPhone XS.jpg"
        },
        {
            "name": "Huawei Y7 2019 Dub-LX3y",
            "description": "Screen Size: 5.5 inches,Rear Camera: 13 MP + 2 MP (f/1.8) AI, Front Camera: 16 MP, 4000 mAh Battery, RAM: 3 GB, ROM: 32 GB (plus up to 512 GB expandable storage via micro SD, not standard)",
            "price": 145.96,
            "countInStock": 20,
            "company": "Huawei",
            "category": "Smart Phones",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Smart Phones/Huawei Y7 2019 Dub-LX3y.jpg"
        },
        {
            "name": "Huawei Y9 Prime 2019",
            "description": "Screen Size: 6.59 inches 128GB ROM, 4GB RAM, Expandable 512GB storage 4000mAh battery,Front camera: 16MP FF, Rear camera: 16MP + 8MP + 2MP, Octa-core, NFC: Not Supported, Dual SIM (Nano-SIM, dual stand-by)",
            "price": 210.0,
            "countInStock": 14,
            "company": "Huawei",
            "category": "Smart Phones",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Smart Phones/Huawei Y9 Prime 2019.jpg"
        },
        {
            "name": "Huawei Nova 5T",
            "description": "Screen Size: 6.3 inches 6.26 inches All-View Display, 16.7 million colours, FHD+ 2340 x 1080, LCD, 97% Screen to Body ratio, 3750 mAh battery ,Memory: 8 GB RAM + 128 GB ROM,Rear Camera: 48 MP (f/1.8, high resolution lens) + 16 MP (f/2.2, ultra wide angle lens) + 2 MP (f/2.4, bokeh lens) + 2 MP (f/2.4, macro lens), Front Camera: 32 MP (f/2.0, high resolution lens)",
            "price": 378.99,
            "countInStock": 7,
            "company": "Huawei",
            "category": "Smart Phones",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Smart Phones/Huawei Nova 5T.jpg"
        },
        {
            "name": "Huawei P30",
            "description": "Display: 6.1 inches w/ OLED capacitive touchscreen, Resolution: 1080 x 2340 pixelse,Internal Memory: 128GB, 8GB RAM, External: NM (Nano Memory), up to 256GB (uses SIM 2),Rear Triple Camera: Triple (40 MP + 16 MP + 8 MP) Camera,Sensors: Fingerprint (under display), accelerometer, gyro, proximity, compass, color spectrum",
            "price": 477.99,
            "countInStock": 3,
            "company": "Apple",
            "category": "Smart Phones",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Smart Phones/Huawei P30.jpg"
        },
        {
            "name": "Honor 9X",
            "description": "6.59 inches TFT LCD (LTPS), 1080 x 2340 pixels, 128GB ROM, 6GB RAM, Expandable 512GB storage 4000mAh battery, NFC: Not Supported, Dual SIM (Nano-SIM, dual stand-by), 3 AI Cameras,Front camera: 16MP FF, Rear camera: 48MP + 8MP + 2MP, ",
            "price": 229.99,
            "countInStock": 6,
            "company": "Apple",
            "category": "Smart Phones",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Smart Phones/honor9x.jpg"
        },
        {
            "name": "Samsung Galaxy A20S",
            "description": "6.5 inches, 103.7 cm2 (~81.9% screen-to-body ratio) 720 x 1560 pixels (HD+),RAM 3GB , ROM 32GB Internal Memory ; MicroSD (Up to 512GB),Main Rear Camera: 13.0 MP + 8.0 MP + 5.0 MP , F1.8 , F2.2 , F2.2 ; Front Camera: 8.0 MP , F2.0, Non-removable Li-Po 4000 mAh battery,",
            "price": 179.82,
            "countInStock": 6,
            "company": "Samsung",
            "category": "Smart Phones",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Smart Phones/Samsung Galaxy A20S.jpg"
        },
        {
            "name": "Samsung Galaxy Note 20",
            "description": "Power of 5G: Get next-level power for everything you love to do with Samsung Galaxy 5G,US Version | 128GB of Storage | Mobile Gaming Smartphone | Long-Lasting Battery | Mystic Bronze (SM-N981UZNAXAA)",
            "price": 999.99,
            "countInStock": 53,
            "company": "Samsung",
            "category": "Smart Phones",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Smart Phones/Samsung Galaxy Note 20.jpg"
        },
        {
            "name": "Samsung Galaxy S10",
            "description": "Screen: 5.8” Infinity Display* ; Full HD+ Dynamic AMOLED,Display: Type Flat, Biometrics: Capacitive Fingerprint ; Facial Recognition,Front Camera: 10MP Selfie Camera, Rear Camera: 12MP Super Speed Dual Pixel ; 16MP Ultra Wide,Capacity: 128GB Storage / 6GB RAM ; 256GB Storage / 8 GB RAM,Battery: 3,100mAh ; All-Day Battery ; Wireless PowerShare",
            "price": 747.0,
            "countInStock": 9,
            "company": "Samsung",
            "category": "Smart Phones",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Smart Phones/Samsung Galaxy S10.jpg"
        },
        {
            "name": "Samsung Galaxy A30S",
            "description": "6.4 inch Infinity-V Super AMOLED display, 720 x 1560 pixels, 4000 mAh Battery with Fast charging 15W, On-Screen Fingerprint, 64GB ROM, 4GB RAM - microSD Up to 1TB, Triple Rear Camera (25MP+8MP+5MP) with LED Flash, Panorama, HDR & 16MP Front Facing Camera, Dual SIM GSM Unlocked A307G/DS - US + Global 4G LTE International Model",
            "price": 279.0,
            "countInStock": 11,
            "company": "Samsung",
            "category": "Smart Phones",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Smart Phones/Samsung Galaxy A30S.jpg"
        },
        {
            "name": "Samsung Galaxy Note 8",
            "description": "6.3-inch Super AMOLED Capacitive Touchscreen, 1440 x 2960 pixel resolution with Corning Gorilla Glass 5,Dual 12 Megapixel Camera with (26mm, f/1.7, PDAF & 52mm, f/2.4, AF), OIS, autofocus, 2x optical zoom, dual-LED (dual tone) flash + 8 Megapixel Front Camera with f/1.7, autofocus,Non-Removable Lithium Polymer 3300 mAh Battery",
            "price": 340.0,
            "countInStock": 11,
            "company": "Samsung",
            "category": "Smart Phones",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Smart Phones/Samsung Galaxy Note 8.jpg"
        },
        {
            "name": "Kids Headphones",
            "description": "noot products K11 Foldable Stereo Tangle-Free 3.5mm Jack Wired Cord On-Ear Headset for Children/Teens/Boys/Girls/Smartphones/School/Kindle/Airplane Travel/Plane/Tablet (Navy/Teal), NO microphone, remote or volume control on these headphones, Compatible with all smartphones and tablets with 3.5mm jack devices",
            "price": 16.99,
            "countInStock": 13,
            "company": "Noot products",
            "category": "Other",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Other/Kids Headphones.jpg"
        },
        {
            "name": "Wireless Headphones Bluetooth",
            "description": "Deep, accurate bass response, extended frequency range, rechargeable, 5-Button control, including play/pause/answer/hang-up, equalizer, next track/volume up, previous track/volume down,Micro SD card plug-in, built in radio receiver, built in mic for hands free calling,Ear cups fit around ears to help isolate Audio, foldable design for easy carry, noise canceling design",
            "price": 18.99,
            "countInStock": 9,
            "company": "iJoy ",
            "category": "Other",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Other/Wireless Headphones Bluetooth.jpg"
        },
        {
            "name": "PeohZarr On-Ear Headphones",
            "description": "On-Ear Headphones with Microphone, Lightweight Folding Stereo Bass Headphones with 1.5M Tangle Free Cord, Portable Wired Headphones for Smartphone Tablet Laptop Computer MP3/4, These headphones with microphone in bright colors are built meticulously with strong and sturdy plastic for long-lasting resilience and durability. Premium 1.5m nylon braiding cord doesn’t tangle or kink, suitable for kids and Children",
            "price": 21.99,
            "countInStock": 6,
            "company": "PeohZarr",
            "category": "Other",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Other/PeohZarr On-Ear Headphones.jpg"
        },
        {
            "name": "Panasonic Headphones",
            "description": "Wired over the Ear Headphones: Full size, classic style Headphones deliver balanced, high frequency sound on par with higher priced headphones for maximum value and hours of listening enjoyment, Powerful Bass, Vocals and Lyrics: Dual 30 millimeter neodymium driver units easily handle up to 1000Mw maximum power input for satisfying bass plus mid-range and high frequency trebles for clear vocals and lyrics",
            "price": 14.99,
            "countInStock": 20,
            "company": "Panasonic",
            "category": "Other",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Other/Panasonic Headphones.jpg"
        },
        {
            "name": "MX Master 2S Wireless Mouse",
            "description": "Use on Any Surface, Hyper-fast Scrolling, Ergonomic Shape, Rechargeable, Control up to 3 Apple Mac and Windows Computers (Bluetooth or USB), Graphite, Battery: rechargeable Li-Po (500 mAh) battery. Rechargable battery: Upto 70 days of power on a single charge; Number of buttons: 7",
            "price": 79.99,
            "countInStock": 17,
            "company": "Logitech",
            "category": "Other",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Other/MX Master 2S Wireless Mouse.jpg"
        },
        {
            "name": "Ergonomic Wireless PC Mouse",
            "description": "full-size wireless mouse with fast-scrolling, clickable wheel and forward/back thumb buttons for fast, easy navigating through large documents and web pages, 2.4 GHz (non-bluetooth) wireless connection; uses a small USB receiver that can stay plugged into your computer without obstructing other ports",
            "price": 21.9,
            "countInStock": 0,
            "company": "AmazonBasics",
            "category": "Other",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Other/Ergonomic Wireless PC Mouse.jpg"
        },
        {
            "name": "M535 Bluetooth Mouse",
            "description": "BLUETOOTH CONNECTIVITY - Use with virtually any Bluetooth enabled computer, laptop, or tablet: Connects to Mac, Windows, Chrome OS and Android, LONG BATTERY LIFE - 10 month battery life helps you go longer between battery changes (battery life may vary based on user and computing conditions)",
            "price": 29.99,
            "countInStock": 11,
            "company": "Logitech",
            "category": "Other",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Other/M535 Bluetooth Mouse.jpg"
        },
        {
            "name": "Gaming Mouse Wired",
            "description": "PICTEK T7 programmable gaming mice, default five DPI levels available from 1200/2400/3500/5500/7200 DPI. With two DPI button, you can adjust the dpi easily to get high accuracy and consistent responsiveness at any speed.  Compatible with Windows 10, Windows 8, Windows 7, Windows XP, Vista, Linux etc. ( Note: no programming function for Mac system).",
            "price": 16.99,
            "countInStock": 7,
            "company": "PICTEK",
            "category": "Other",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Other/Mouse Wired.jpg"
        },
        {
            "name": "Samsung Flash Drive",
            "description": "COMPACT FLASH DRIVE: Exceptionally compact Samsung FIT Plus USB flash drive for instant storage of your photos, videos, music, and files on laptops, tablets, TV’s, car audio systems, gaming consoles and more, QUICK AND CONVENIENT READ SPEEDS: Redefine everyday file transfers with read speeds up to 300MB/s; USB 3.1 flash drive with backwards compatibility (USB 3.0, USB 2.0)",
            "price": 19.99,
            "countInStock": 20,
            "company": "Samsung",
            "category": "Other",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Other/Samsung Flash Drive.jpg"
        },
        {
            "name": "JUANWE USB Flash Drive",
            "description": "Flash drive 32gb 2 pack,  No need to install any software. The jump drive support Windows 7 / 8 / 10 / Vista / XP / Unix / 2000 / ME / NT Linux and Mac OS, compatible with USB 2.0 and 1.1 ports",
            "price": 9.99,
            "countInStock": 14,
            "company": "JUANWE",
            "category": "Other",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Other/JUANWE USB Flash Drive.jpg"
        },
        {
            "name": "SanDisk Flash Drive",
            "description": "SanDisk Cruzer 128GB USB 2.0 Flash Drive",
            "price": 17.99,
            "countInStock": 30,
            "company": "SanDisk",
            "category": "Other",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Other/SanDisk Flash Drive.jpg"
        },
        {
            "name": "Seagate External Hard Drive",
            "description": "Seagate Portable 2TB External Hard Drive Portable HDD – USB 3.0 for PC, Mac, PS4, & Xbox (STGX2000400)",
            "price": 45.99,
            "countInStock": 7,
            "company": "Seagate",
            "category": "Other",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Other/Seagate External Hard Drive.jpg"
        },
        {
            "name": "WD External Hard Drive",
            "description": "WD 2TB Elements Portable External Hard Drive, USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system",
            "price": 29.99,
            "countInStock": 9,
            "company": "Western Digital",
            "category": "Other",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Other/WD External Hard Drive.jpg"
        },
        {
            "name": "Seagate External Hard Drive",
            "description": "Seagate STEA2000403 Game Drive 2TB External Hard Drive Portable HDD, Designed for Xbox One, Dive into the action with a quick step by step setup and plug and play USB 3.0 connectivity no power cable needed",
            "price": 89.99,
            "countInStock": 7,
            "company": "Seagate",
            "category": "Other",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Other/Seagate HardDrive.jpg"
        },
        {
            "name": "SanDisk Memory Card",
            "description": "Ideal for Android Smartphones and Tablets, and MIL Cameras Capacities up to 512GB (1GB=1,000,000,000 bytes; Actual user storage less) to store even more hours of Full HD video (Approximations; Results and Full HD (1920x1080) video support may vary based on host device, file attributes and other factors), Up to 100MB/s transfer read speed (Based on internal testing;",
            "price": 40.99,
            "countInStock": 40,
            "company": "SanDisk ",
            "category": "Other",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Other/SanDisk Memory Card.jpg"
        },
        {
            "name": "Fitbit Smartwatch",
            "description": "Fitbit Versa 2 Health and Fitness Smartwatch with Heart Rate, Music, Alexa Built-In, Sleep and Swim Tracking, Black/Carbon, One Size (S and L Bands Included), Track heart rate 24/ 7, steps, distance, calories burned, hourly activity, active minutes and floors climbed. Syncing range - up to 6.1 meters, plus store and play 300+ songs on your wrist",
            "price": 199.34,
            "countInStock": 15,
            "company": "Fitbit ",
            "category": "Other",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Other/Fitbit Smartwatch.jpg"
        },
        {
            "name": "Huawei Wireless Bluetooth Earphone",
            "description": "Huawei FreeBuds 3 - Wireless Bluetooth Earphone with Intelligent Noise Cancellation (Kirin A1 Chipset, Ultra-Low Latency, Fast Bluetooth Connection, 14mm Speaker, Quick Wireless Charging), This extends to more than 12 hours of calls and 20 hours of music playback.",
            "price": 152.77,
            "countInStock": 22,
            "company": "Huawei ",
            "category": "Other",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Other/Huawei Wireless Bluetooth Earphone.jpg"
        },
        {
            "name": "Samsung Galaxy Watch Active2",
            "description": "You can see if your heart rate is where you want it with Galaxy Watch Active2; Get automatically alerted if your watch detects a high or a low heart rate 4 this device and related software are not intended for use in the diagnosis of disease or other conditions, or in the cure, Mitigation, treatment or prevention of disease, attery built for endurance. The Galaxy Watch active2’s long-lasting battery can go for more than a 5 day on a single charge",
            "price": 249.0,
            "countInStock": 14,
            "company": "Samsung",
            "category": "Other",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Other/Samsung Galaxy Watch Active2.jpg"
        },
        {
            "name": "Anker PowerCore 10000 Portable Charger",
            "description": " One of the smallest and lightest 10,000mAh portable chargers. Provides almost three-and-a-half iPhone 8 charges or two-and-a-half Galaxy S8 charges, Anker’s exclusive PowerIQ and VoltageBoost combine to deliver the fastest possible charge for any device. Qualcomm Quick Charge not supported.",
            "price": 21.99,
            "countInStock": 30,
            "company": "Anker",
            "category": "Other",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Other/Anker PowerCore 10000 Portable Charger.jpg"
        },
        {
            "name": "Anker Wireless Charger",
            "description": "Instantly charge your phone or earbuds simply by placing them in the center of PowerWave Pad. Never fuss around with plugging and unplugging cables again, just set down and power up.PowerWave Pad Qi-Certified 10W Max for iPhone SE (2020), 11, 11 Pro, 11 Pro Max, Xs Max, XR, XS, X, 8, 8 Plus, AirPods, Galaxy S20 S10 S9 S8, Note 10 9 8 (No AC Adapter).",
            "price": 10.99,
            "countInStock": 10,
            "company": "Seagate",
            "category": "Other",
            "user": "5d7a514b5d2c12c7449be042",
            "img": "img/Other/Anker Wireless Charger.jpg"
        }
    ]`;

    const products = JSON.parse(data);

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
    console.log(newProducts);

    newProducts.forEach(product => {
        let markup = `
        <div class="card mt-2" style="width: 18rem;" data-id="${product.id}" data-category="${product.categoryId}">
            <img class="card-img-top" src="${product.img}" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <span class="text-muted d-block fs-2 mb-3">$${product.price.toFixed(2)}</span>
                    <a href="#" class="btn btn-danger">View</a>
                </div>
        </div>
    `
        document.querySelector(".products").insertAdjacentHTML("beforeend", markup);
    });
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
    var categories = renderSidebarLinks();
    renderProducts(categories);
    mediaQueries();
}

init();

//Картинки