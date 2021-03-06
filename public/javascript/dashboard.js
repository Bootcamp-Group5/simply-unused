const historyList = document.querySelector('.list');
let searchHistory = [];

loadHistory();
dateStatus();
document.querySelector("#search-product").addEventListener('submit', searchProductHandler);
document.querySelector("#clear").addEventListener('click', clearHistory);
historyList.addEventListener('click', historySearchHandler);
document.querySelectorAll(".update-btn").forEach(item => {
    item.addEventListener('click', updateProductHandler);
});
document.querySelectorAll(".remove-btn").forEach(elm => {
    elm.addEventListener('click', removeProductHandler);
});
document.querySelector('#showall').addEventListener('click', (e) => {
    e.preventDefault();

    window.location = "/dashboard";
});
document.querySelector('#order-exp').addEventListener('click', sortByExp);
document.querySelector('#order-q').addEventListener('click', sortByQ);
loadProductImage();
checkOrderBy();

function checkOrderBy() {
    const ordered = window.location.pathname.split('/').pop() === 'd';

    if (ordered) {
        const idArr = ['#sort-by-category', '#sort-by-name'];
        for (id of idArr) {
            const h4El = document.querySelector(id);
            h4El.classList.add('dbld');
            h4El.querySelector('a').classList.add('dbld');
            h4El.querySelector('a').href = "javascript: void(0)";
            console.log('added');
        };
    };
};

function sortByExp() {
    const locArr = window.location.pathname.split('/');
    const ordered = locArr.pop() === 'd';
    const pName = locArr.pop();

    if (ordered) {
        loc = '/dashboard/orderBy/expiration_date/' + pName + '/d';
        console.log(loc);

        return window.location = loc;
    };

    window.location = '/dashboard/orderBy/expiration_date';
};

function sortByQ() {
    const locArr = window.location.pathname.split('/');
    const ordered = locArr.pop() === 'd';
    const pName = locArr.pop();

    if (ordered) {
        loc = '/dashboard/orderBy/quantity/' + pName + '/d';
        console.log(loc);

        return window.location = loc;
    };

    window.location = '/dashboard/orderBy/quantity';
};

function dateStatus() {
    document.querySelectorAll('.exp-date').forEach(date => {
        const card = date.closest('.card-body');
        const icon = card.querySelector('.icon-status');

        const expDate = moment(date.textContent, 'YYYY-MM-DD')
        const today = moment();

        const dateDiff = today.diff(expDate, 'days');

        if (dateDiff >= 0) {
            icon.classList.add('past');
        } else if (dateDiff >= -3) {    
            icon.classList.add('danger');
        } else {
            icon.classList.add('safe');
        };

    });
}

function loadProductImage() {
    document.querySelectorAll('.product-image').forEach(elm => {
        const category = elm.closest('.product-card').querySelector('.product-category').textContent.toLowerCase();
        elm.src = `/images/${category}.png`
    })
}

function searchProductHandler(e) {
    e.preventDefault();
    const productName = getProductName();
    console.log(productName);

    if (!productName) {
        alert('Please enter a name!');
    } else {
        searchProduct(productName);
        addToSearchHistory(productName);
    }
};

function addToSearchHistory(pName) {
    let isIncluded = false;
    for (let i = 0; i < searchHistory.length; i++) {
        if (searchHistory[i] === pName) {
            isIncluded = true;
            break;
        }
    }
     
    if (!isIncluded) {
        addToList(pName);

        searchHistory.push(pName);
        localStorage.setItem('history', JSON.stringify(searchHistory));
    }
};

function getProductName() {
    const productNameEl = document.querySelector("#p-name"); 
    let productName = productNameEl.value.trim();

    if(!productName) {
        return false;
    } else {
        productName = productName[0].toUpperCase() + productName.substring(1).toLowerCase();

        productNameEl.value = '';
        return productName;
    }
};

function searchProduct(pName) {
    console.log(pName);
    window.location = `/api/products/${pName}/d`;
};

function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
};

function loadHistory() {
    searchHistory = JSON.parse(localStorage.getItem('history')) || [];
    
    searchHistory.forEach(item => addToList(item));
};

function addToList(item) {
    const liEl = document.createElement('li');
    liEl.textContent = item;

    historyList.prepend(liEl);
};

function clearHistory() {
    searchHistory = [];
    localStorage.removeItem('history');

    while (historyList.hasChildNodes()) {
        historyList.removeChild(historyList.firstChild);
    };
};

function historySearchHandler(e) {
    if (e.target.closest('li')) {
        const product = e.target.textContent;
        searchProduct(product);
    };
};

async function updateProductHandler(e) {
    e.preventDefault();
    const card = e.target.closest('.p-card');
    const id = card.getAttribute('data-id');

    const quantity = card.querySelector('.quantity-nu').value;

    if (!quantity) {
        alert('Invalid value for quantity!');
        return 0;
    };

    if (quantity === '0') {
        deleteProductById(id);
    } else {
        updateProductByQuantity(id, quantity);
    };
    alert('Successfully updated!!')
};

async function deleteProductById(id) {
    await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    location.reload();
};

async function updateProductByQuantity(id, quantity) {
    await fetch(`/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            quantity,
        }),
        headers: { 'Content-Type': 'application/json' }
    });
}

async function removeProductHandler(e) {
    e.preventDefault();
    const d = confirm('Are you sure you want to delete the product?');

    if (!d) {
        return 0;
    };

    const card = e.target.closest('.p-card');
    const id = card.getAttribute('data-id');
    await deleteProductById(id);
    alert('Successfully deleted!')
};
