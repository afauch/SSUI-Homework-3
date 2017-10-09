//
//	browse.js
//  This file contains logic that dynamically
//  constructs the product browsing page.
//


// On DOM loaded
document.addEventListener("DOMContentLoaded", function(e) {
	var browseItems = document.getElementById("browse-items");
	for(var i = 0; i < products.length; i++) {
		// Load the template HTML
		var productData = loadData("../browse-item.html");
		// Add the template HTML to the div
		browseItems.innerHTML += productData;
		// Select the element we just created
		var element = browseItems.childNodes[i+1];
		// Change the HTML content
		element.getElementsByTagName("h1")[0].innerHTML = products[i].productName;
		element.getElementsByTagName("p")[0].innerHTML = products[i].productDescShort;				
		// Dynamically construct a string
		var hrefString = 'product.html?product=' + products[i].productId;
		element.getElementsByTagName("a")[0].setAttribute('href', hrefString);
	}
});