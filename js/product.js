//
//	product.js
//  This file contains classes and functions that
//  handle user interaction on product detail pages.
//

// This class stores the user's current selection on a product page
// So it can be added to the cart later.
class Selection {
	constructor(productId, selectionQty, selectionPrice) {
		this.productId = productId;
		this.selectionQty = selectionQty;
		this.selectionPrice = selectionPrice;
	}
}

// Global variables
var currentSelection;
var currentProduct;

// On DOM loaded
document.addEventListener("DOMContentLoaded", function(e) {
	// Load the HTML of the product details
	loadProductDetails();
	// Instantiate the currentSelection logic
	createSelection();
	// Add event listners to page elements
	document.getElementById('product-qty').addEventListener('change', onChangeSelectionQty);
});

// Load the correct product details
function loadProductDetails() {
	// Grab the parameters from the URL
	console.log(window.location.search);
	var params = new URLSearchParams(window.location.search);
	// Grab the product key
	var thisProductId = params.get('product');
	console.log(thisProductId);
	// Lookup the correct product
	for(p of products){
		if(p.productId == thisProductId){
			populateProductDetails(p);
			currentProduct = p;
		}
	}
}

// Populate the page's HTML with the correct product details
function populateProductDetails(product) {
	// Populate the product details with the data from the product object
	document.getElementById("product-name").innerHTML = product.productName;
	document.getElementById("product-desc-long").innerHTML = product.productDescLong;
	document.getElementById("product-price").innerHTML = '$' + product.productPrice;
}

// Create an initial, default selection
function createSelection() {
	// Creates a temporary selection that can be added to the cart
	currentSelection = new Selection(currentProduct.productId, 1, currentProduct.productPrice);
}

// Update price on change of quantity
function onChangeSelectionQty() {
	var q = document.getElementById('product-qty');
	var newQty = q.options[q.selectedIndex].value;
	var newPrice = newQty * currentProduct.productPrice;
	currentSelection.selectionQty = parseInt(newQty);
	currentSelection.selectionPrice = newPrice;
	// Update the price
	document.getElementById('product-price').innerHTML = '$' + newPrice;
}