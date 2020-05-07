const promotions = {
	singleLook: 'SINGLE LOOK',
	doubleLook: 'DOUBLE LOOK',
	tripleLook: 'TRIPLE LOOK',
	fullLook: 'FULL LOOK'
};

function getShoppingCart(ids, productsList) {
	const productsSummary = generateProductsSummary(ids, productsList);
	const promotion = getPromotionType(countDistinctCategories(productsSummary));
	const bill = calculateBill(productsSummary, promotion);

	const getDiscountPercentage = () => `${ ((bill.accumulatedDiscount * 100) / bill.fullPrice).toFixed(2) }%`;

	return {
		products: refineProductsSummary(productsSummary),
		promotion: promotion,
		totalPrice: (bill.fullPrice - bill.accumulatedDiscount).toFixed(2),
		discountValue: (bill.accumulatedDiscount).toFixed(2),
		discount: getDiscountPercentage()
	};
}


function calculateBill(productsSummary, promotion) {
	const calculatedBill = productsSummary.reduce((bill, product) => {
		bill.fullPrice += product.tempPrices['regularPrice'];

		if(product.tempPrices[promotion] != undefined)
			bill.accumulatedDiscount += (product.tempPrices['regularPrice'] - product.tempPrices[promotion]);

		return bill;

	}, { fullPrice: 0.0, accumulatedDiscount: 0.0 });

	return calculatedBill;
}


function generateProductsSummary(ids, productsList) {
	const productsSummary = [];
	let product;

	ids.forEach(id => {
		// Finds the product with the given Id
		product = productsList.find(p => p.id == id);
		// Adds product
		productsSummary.push({ 
			name: product.name,
			category: product.category,
			tempPrices: 
			{
				regularPrice: product.regularPrice,
				'SINGLE LOOK': tryGetPromotionPrice(promotions.singleLook, product) ,
				'DOUBLE LOOK': tryGetPromotionPrice(promotions.doubleLook, product),
				'TRIPLE LOOK': tryGetPromotionPrice(promotions.tripleLook, product),
				'FULL LOOK': tryGetPromotionPrice(promotions.fullLook, product)
			}
		});
	});

	return productsSummary;
}


function refineProductsSummary(productsSummary) {
	
	productsSummary.forEach(product => {
		delete product.tempPrices;
	});

	return productsSummary;
}


function tryGetPromotionPrice(promotionName, product) {
	const promotions = product.promotions;
	let promotion;

	/* Iterates over the product's available promotions trying to find the given promotion.
	 	If found, its price is returned, otherwise, 'undefined'
	*/
	 for(let i = 0; i < promotions.length; i++) {
		promotion = promotions[i];
		if(promotion['looks'].includes(promotionName)) 
			return promotion['price'];
	}
	return undefined;
}


function countDistinctCategories(productsSummary) {

	const distinctCategories = productsSummary.reduce((existingCategories, product) => {
		
		if(existingCategories.includes(product.category) == false) {
			return [...existingCategories, product.category];
		}			
		return existingCategories;
	}, []);
	
	return distinctCategories.length;
}

function getPromotionType(countDistinctCategories) {
	switch(countDistinctCategories) {
		case 1: return promotions.singleLook;
		case 2: return promotions.doubleLook;
		case 3: return promotions.tripleLook;
		default: return promotions.fullLook;
	}
}

module.exports = { getShoppingCart };