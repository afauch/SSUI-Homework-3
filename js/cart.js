//
//	cart.js
//  This file contains classes and methods used for
//  cart management across all pages.
//


// Class representing a cart line item
class CartItem {
	constructor(productId, qty) {
		this.productId = productId;
		this.qty = parseInt(qty);
		this.product = getProduct(productId);
		this.productPrice = this.product.productPrice;
		this.cartItemPrice = this.qty * this.productPrice;
	}
	calculateCartItemPrice(){
		this.cartItemPrice = this.qty * this.productPrice;
	}
}

// Class representing the entire shopping cart
class Cart {
	constructor(){
		this.cartItems = [];
		this.itemCount = 0;
		this.cartPrice = 0;
	}

	// Loads cart data from session storage
	loadData(data) {
		for(var item of data.cartItems){
			this.addNewItem(item.productId, item.qty);
		}
		this.itemCount = parseInt(data.itemCount);
		this.update();
	}

	// Contains logic to determine whether a new addition
	// should be added to an existing cart line item
	// or whether it should be added as a new cart line item
	addItems(productId, qty) {
		// Is there already an item with this productId in the cart?
		if(this.cartItems.length > 0){
			var alreadyInCart = false;
			for(var item of this.cartItems) {
				if(item.productId == productId) {
					alreadyInCart = true;
					// Add the quantity
					item.qty += parseInt(qty);
					break;
				} else {
					alreadyInCart = false;					
					continue;
				}
			}
			if(alreadyInCart === false) {
				this.addNewItem(productId, qty);
			}
		} else {
			this.addNewItem(productId, qty);
		}
	// Update the cart
	this.update();							
	}

	// Adds a new item to the cart
	addNewItem(productId, qty) {
		var newCartItem = new CartItem(productId, qty);
		this.cartItems.push(newCartItem);
	}

	changeItemQty(productId, newQty) {
		// Match to the correct cart line item
		for(var item of this.cartItems){
			if(item.productId == productId) {
				// Assign the new quantity
				item.qty = parseInt(newQty);
			}
		}
		// Update the cart
		this.update();
	}

	// Calls generic functions to run on any cart update
	update() {
		// Count up the items
		this.logCart();
		this.countItems();
		this.calculateCartPrice();
		this.saveCart();
		this.renderCart();
	}

	// Debug function for viewing cart contents
	logCart() {
		// console.log('userCart: ');
		// console.log(userCart);
	}

	// Counts up the total items in the cart
	// to display on the navBar
	countItems() {
		this.itemCount = 0; // Reset item count before re-counting
		for(var item of this.cartItems) {
			this.itemCount += parseInt(item.qty);
		}
	}

	// Calculate the total cart price
	calculateCartPrice() {
		// Initialize to 0
		this.cartPrice = 0;
		if(this.cartItems.length > 0) {
			for(var item of this.cartItems) {
				item.calculateCartItemPrice();
				this.cartPrice += parseInt(item.cartItemPrice);
			}
		}
	}

	// Saves cart data to localstorage
	saveCart() {
		localStorage.setItem('storedCart', JSON.stringify(userCart));
	}

	// Renders the cart's contents to the DOM
	renderCart(){
		// This prevents errors if the DOM isn't fully loaded.
		// There is an event listener that will call this again,
		// when the DOM does load.
		if (document.readyState === 'interactive' || document.readyState === 'complete') {
			renderItemCount(this.itemCount);
			renderCartItems(this.cartItems);
			renderCartPrice(this.cartPrice);
		}
	}

	// For removing an item from the cart
	removeCartItem(productIdToRemove) {
		// Remove the item from the cart
		for(var i = 0; i < this.cartItems.length; i++){
			// Is this the item we're removing?
			if(this.cartItems[i].productId == productIdToRemove){
				// Remove this element from cart items
				this.cartItems.splice(i, 1);
				break;
			} else {
				continue;
			}
		}
		this.update();
	}
}

// Function to render the number of items in the cart to the nav bar
function renderItemCount(itemCount){
	// Render the total number of items to the nav bar
	if(parseInt(itemCount) > 0) {
		document.getElementById('number-items').innerHTML = itemCount;
	} else {
		document.getElementById('number-items').innerHTML = null;
	}
}

// Function to render the actual items into the cart
function renderCartItems(cartItems){
	// Access the cart-items UL
	var cartItemsUl = document.getElementById('cart-items');
	cartItemsUl.innerHTML = null;
	// if there are items in our cart
	if(cartItems.length > 0) {
		for(var i = 0; i < cartItems.length; i++) {
			// import the HTML to the cartItemsUl div
			cartItemsUl.innerHTML += loadData('../cart-item.html');
			// select the one we just added
			var element = cartItemsUl.children[i];
			// add a special data attribute to the li
			element.setAttribute('data-product-id', cartItems[i].productId);
			// add an id to the <select> tag so we can grab it later
			var selectIdString = cartItems[i].productId + '-qty-select';
			element.getElementsByTagName('select')[0].setAttribute('id', selectIdString);
			// set the quantity of the select
			document.getElementById(selectIdString).selectedIndex = parseInt(cartItems[i].qty)-1;
			document.getElementById(selectIdString).options[parseInt(cartItems[i].qty)-1].setAttribute('selected','true');
			// set the name of the product
			element.getElementsByClassName('cart-item-title')[0].innerHTML = cartItems[i].product.productName;
			// set the Cart Item price
			element.getElementsByClassName('cart-item-price')[0].innerHTML = '$' + cartItems[i].cartItemPrice.toString();

		}
	} else {
		// Display a placeholder message.
		cartItemsUl.innerHTML = '<span>You have no items in your cart.</span>';
	}
	// Once all elements have been drawn, add listeners
	addListeners();

}

// This function adds cart event listeners after their HTML elements
// have been drawn (otherwise these listeners would be overwritten)
function addListeners() {
	var cartItemsUl = document.getElementById('cart-items');
	if(userCart.cartItems.length > 0) {
		for(var i = 0; i < cartItemsUl.childNodes.length; i++) {
			// Add 'Remove item' click listener
			document.getElementsByClassName('cart-item-remove')[i].addEventListener('click',function(e){
				var productIdToRemove = e.srcElement.parentElement.getAttribute('data-product-id');
				userCart.removeCartItem(productIdToRemove);
			});
			// Quantity change listener
			cartItemsUl.getElementsByTagName('select')[i].addEventListener('change',function(e){
				var productIdToChange = e.srcElement.parentElement.getAttribute('data-product-id');			
				var newQty = e.srcElement.value;
				userCart.changeItemQty(productIdToChange, newQty);
			});
		}
	}
}


// Render the total cart price
function renderCartPrice(cartPrice) {
	// Select the element and change its HTML
	document.getElementById('cart-items-total').innerHTML = 'Total $' + cartPrice;
}

// Global variable userCart
var userCart;
loadCart();

// Load the cart from local storage
function loadCart() {
	// If the user has a cart saved in storage, use that cart.
	var storedCart = JSON.parse(localStorage.getItem("storedCart"));
	// If we have a stored cart, use it
	if (storedCart !== null) {
		userCart = new Cart();
		userCart.loadData(storedCart);
	} else {
		// Otherwise, create a new cart and add it to local storage.
		userCart = new Cart();
		userCart.saveCart();
	}
}


// Utility function for getting a product by productId
function getProduct (productId) {
	var thisProduct;
	for(var product of products) {
		// Look up the product
		if(product.productId == productId){
			thisProduct = product;
			break;
		} else {
			continue;
		}
	}
	return thisProduct;
}

// On DOM loaded
document.addEventListener('DOMContentLoaded', function(e) {
	// Is this the addCart page? Add listners to Add To Cart
	addToCartListeners();
	userCart.update();
});

// Add listeners for Add To Cart
function addToCartListeners() {
	// is this a product page?
	if(document.getElementsByTagName('body')[0].getAttribute('id') == 'product'){
		// if so, listen for the 'add to cart' click event
		document.getElementById('add-to-cart-button').addEventListener('click', addItemToCart);
	}
}

// Add current selection to cart
function addItemToCart() {
	userCart.addItems(currentSelection.productId, currentSelection.selectionQty);
}


// Open (show) the cart
function openCart() {
    document.getElementById('cart').style.right = '0px';
    document.getElementById('container').style.left = '-512px';
    document.getElementById('close-cart').style.transform = "rotate(-180deg)";
}

// Close (hide) the cart
function closeCart() {
      document.getElementById('cart').style.right = '-512px';
      document.getElementById('container').style.left= '0px';	
		document.getElementById('close-cart').style.transform = "rotate(0deg)";      
}