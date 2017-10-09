//
//	main.js
//  This file is loaded across all pages
//  and handles the loading of product data.
//

'use strict';

// Global product variable
var products = []

// Create a class that houses product data
class Product {
	constructor(productId, productName, productDescShort, productDescLong, productPrice) {
		this.productId = productId;
		this.productName = productName;
		this.productDescShort = productDescShort;
		this.productDescLong = productDescLong;
		this.productPrice = productPrice;
	}
}

// Load the product data
loadProductData();

// Load product data from JSON
function loadProductData() {
	var data = loadData('js/products.json');
	// console.log(data);
	constructProductsList(data);
}

// Dynamically create the list of products
function constructProductsList(data) {
	var jsonData = JSON.parse(data);
	// console.log(jsonData[0]);
	for(var product of jsonData) {
		// add the product to the object list
		// console.log(item);
		var thisProduct = new Product(
			product.productId,
			product.productName,
			product.productDescShort,
			product.productDescLong,
			product.productPrice);
		products.push(thisProduct);
	}
}

// On DOM loaded
document.addEventListener('DOMContentLoaded', function(e) {
	// Add event listeners for DOM open/close
	document.getElementById('cart-link').addEventListener('click', openCart);
	document.getElementById('close-cart').addEventListener('click', closeCart);
});

// Function to load the individual HTML
function loadData(url) {
	// Source:
	// https://stackoverflow.com/questions/17901116/i-need-the-equivalent-of-load-to-js
	var req = new XMLHttpRequest();
    req.open('GET', url, false);
    req.send(null);
    var data = req.responseText;
    return data;
}