async function getAllProducts() {
    const products = await fetch('/api/products').then(res => res.json());

    saveProducts(products);
};

function searchProductHandler(e) {
    e.preventDefault();
    const productName = getProductName();

    if(!productName) {
        return alert('You need to enter an item!');
    };

    searchProduct(productName);
};

function getProductName() {
    const productNameEl = document.querySelector("#p-name"); 
    const productName = productNameEl.value.toLowerCase();

    productNameEl.value = '';
    return productName
};

async function searchProduct(pName) {
    // the apiRoute is not correct!!!
    const res = await fetch(`/api/products/${pName}`).then(res => res.json());
    
    if (res.ok) {
        saveProducts(res);
    }
};

function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
};


getAllProducts();
document.querySelector("#search-product").addEventListener('submit', searchProductHandler);