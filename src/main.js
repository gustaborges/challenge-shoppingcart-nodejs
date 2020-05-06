const {getShoppingCart} = require('./index.js');
const { products } = require('./data/products');


const exemplo4Mock = {
	products: [
		{ name: 'PINK PANTHER™ T-SHIRT', category: 'T-SHIRTS' },
		{ name: 'RUBBERIZED PRINTED T-SHIRT', category: 'T-SHIRTS' },
		{ name: 'CONTRAST SLOGAN T-SHIRT', category: 'T-SHIRTS' },
		{ name: 'KNIT JOGGING PANTS', category: 'PANTS' },
		{ name: 'ASYMMETRICAL LEATHER SLIDE HEELS', category: 'SHOES' },
		{ name: 'SLINGBACK KITTEN HEEL SHOES WITH METAL DETAIL', category: 'SHOES' }
	],
	promotion: 'TRIPLE LOOK',
	totalPrice: '784.94',
	discountValue: '130.00',
	discount: '14.21%'
};

const result = getShoppingCart([110, 130, 140, 230, 310, 330], products);

console.log(result);
