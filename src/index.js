const promotions = ['SINGLE LOOK', 'DOUBLE LOOK', 'TRIPLE LOOK', 'FULL LOOK'];


function getShoppingCart(ids, productsList) {

	const productsSummary = generateProductsSummary(ids, productsList);
	const promotion = getPromotionType(countDistinctCategories(productsSummary));

	const bill = calculateBill(productsSummary, promotion);

	const getDiscountPercentage = () => `${(bill.accumulatedDiscount * 100) / bill.fullPrice}%`;
	

	//removePricesPropertyFromObject(productsSummary); 
	
	productsSummary.forEach(product => {
		delete product.tempPrices;
	});

	// TO-DO: devolver o ShoppingCart
	return {
		products: productsSummary,
		promotion: promotion,
		totalPrice: (bill.fullPrice - bill.accumulatedDiscount).toString(),
		discountValue: (bill.accumulatedDiscount).toString(),
		discount: getDiscountPercentage()
	};

}


function calculateBill(productsSummary, promotion) {

	const bill = productsSummary.reduce((bill, product) => {
		
		// PROBLEM AQUI
		bill.totalPrice += product.regularPrice;
		// Checks for discounts and add to the object
		if(product.tempPrices[promotion] != undefined) {
			bill.accumulatedDiscount += ( product.regularPrice - product.tempPrices[promotion] );
		}
		return bill;

	}, { fullPrice: 0.0, accumulatedDiscount: 0.0 });

	return bill;
}


function generateProductsSummary(ids, productsList) {
	const productsSummary = [];
	let product;


	ids.forEach(id => {
		product = productsList.find(p => p.id == id);
		console.log( product);

		console.log( tryGetPromotionPrice('SINGLE LOOK', product));
		productsSummary.push(
		{ 
			name: product.name,
			category: product.category,
			tempPrices:
				{
					regularPrice: product.regularPrice,
					'SINGLE LOOK': tryGetPromotionPrice('SINGLE LOOK', product) ,
					'DOUBLE LOOK': tryGetPromotionPrice('DOUBLE LOOK', product),
					'TRIPLE LOOK': tryGetPromotionPrice('TRIPLE LOOK', product),
					'FULL LOOK': tryGetPromotionPrice('FULL LOOK', product),
				}
		});
	});

	return productsSummary;
}


function tryGetPromotionPrice(promotionName, product) {
	const promotions = product.promotions;

	promotions.forEach(promotion => {
		if(promotion['looks'].includes(promotionName)) {
			return promotion['price'];
		}
	});

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
		case 1: return 'SINGLE LOOK';
		case 2: return 'DOUBLE LOOK';
		case 3: return 'TRIPLE LOOK';
		default: return 'FULL LOOK';
	}
}


module.exports = { getShoppingCart };