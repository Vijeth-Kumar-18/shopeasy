document.addEventListener('DOMContentLoaded', function() {
    const productsContainer = document.getElementById('products-container');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');
    const categoryLinks = document.querySelectorAll('[data-category]');
    
    // Load products based on URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
        categoryFilter.value = categoryParam;
    }
    
    // Initial load
    filterAndDisplayProducts();
    
    // Event listeners
    searchBtn.addEventListener('click', filterAndDisplayProducts);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            filterAndDisplayProducts();
        }
    });
    
    categoryFilter.addEventListener('change', filterAndDisplayProducts);
    sortBy.addEventListener('change', filterAndDisplayProducts);
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            categoryFilter.value = this.getAttribute('data-category');
            filterAndDisplayProducts();
        });
    });
    
    function filterAndDisplayProducts() {
        let filteredProducts = [...products];
        
        // Filter by search term
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
        }
        
        // Filter by category
        const selectedCategory = categoryFilter.value;
        if (selectedCategory !== 'all') {
            filteredProducts = filteredProducts.filter(
                product => product.category === selectedCategory
            );
        }
        
        // Sort products
        const sortOption = sortBy.value;
        switch (sortOption) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            default:
                // Default sorting (by ID or as they are in the array)
                break;
        }
        
        // Display products
        displayProducts(filteredProducts);
    }
    
    function displayProducts(productsToDisplay) {
        productsContainer.innerHTML = '';
        
        if (productsToDisplay.length === 0) {
            productsContainer.innerHTML = '<p class="no-products">No products found matching your criteria.</p>';
            return;
        }
        
        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="rating">${generateStars(product.rating)}</div>
                    <p class="price">₹${product.price.toFixed(2)}</p>
                    <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
                    <a href="product-details.html?id=${product.id}" class="btn view-details">View Details</a>
                </div>
            `;
            productsContainer.appendChild(productCard);
        });
    }
    
    function generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i - 0.5 <= rating) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }
});