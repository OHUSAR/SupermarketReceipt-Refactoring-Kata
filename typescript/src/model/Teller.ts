import {SupermarketCatalog} from "./SupermarketCatalog"
import {OffersByProduct, ShoppingCart} from "./ShoppingCart"
import {Product} from "./Product"
import {Receipt} from "./Receipt"
import {Offer} from "./Offer"
import {SpecialOfferType} from "./SpecialOfferType"
import BagOfOffers from './BagOfOffers';
import { Discount } from './Discount';

/*
* Teller
* - doing the ShoppingCart -> Receipt translation
*   - calculating the unit prices
*   - delegating the offers calculation to cart
*   - creating the receipt
* */

export class Teller {
    public constructor(
        private readonly catalog: SupermarketCatalog,
        private readonly bagOfOffers: BagOfOffers
    ) {}

    public checksOutArticlesFrom(theCart: ShoppingCart): Receipt {
        const receipt = new Receipt();
        const productQuantities = theCart.getItems();
        for (let pq of productQuantities) {
            let p = pq.product;
            let quantity = pq.quantity;
            let unitPrice = this.catalog.getUnitPrice(p);
            let price = quantity * unitPrice;
            receipt.addProduct(p, quantity, unitPrice, price);
        }
        this.handleOffers(theCart, receipt);

        return receipt;
    }

    private handleOffers(theCart: ShoppingCart, receipt: Receipt ):void {
        for (const productName in theCart.productQuantities()) {
            const productQuantity = theCart.productQuantities()[productName]
            const product = productQuantity.product;
            const quantity: number = theCart.productQuantities()[productName].quantity;
            if (this.bagOfOffers.getOffers()[productName]) {
                const offer : Offer = this.bagOfOffers.getOffers()[productName];
                const unitPrice: number= this.catalog.getUnitPrice(product);
                let quantityAsInt = quantity;
                let discount : Discount|null = null;
                let x = 1;
                if (offer.offerType == SpecialOfferType.ThreeForTwo) {
                    x = 3;

                } else if (offer.offerType == SpecialOfferType.TwoForAmount) {
                    x = 2;
                    if (quantityAsInt >= 2) {
                        const total = offer.argument * Math.floor(quantityAsInt / x) + quantityAsInt % 2 * unitPrice;
                        const discountN = unitPrice * quantity - total;
                        discount = new Discount(product, "2 for " + offer.argument, discountN);
                    }

                } if (offer.offerType == SpecialOfferType.FiveForAmount) {
                    x = 5;
                }
                const numberOfXs = Math.floor(quantityAsInt / x);
                if (offer.offerType == SpecialOfferType.ThreeForTwo && quantityAsInt > 2) {
                    const discountAmount = quantity * unitPrice - ((numberOfXs * 2 * unitPrice) + quantityAsInt % 3 * unitPrice);
                    discount = new Discount(product, "3 for 2", discountAmount);
                }
                if (offer.offerType == SpecialOfferType.TenPercentDiscount) {
                    discount = new Discount(product, offer.argument + "% off", quantity * unitPrice * offer.argument / 100.0);
                }
                if (offer.offerType == SpecialOfferType.FiveForAmount && quantityAsInt >= 5) {
                    const discountTotal = unitPrice * quantity - (offer.argument * numberOfXs + quantityAsInt % 5 * unitPrice);
                    discount = new Discount(product, x + " for " + offer.argument, discountTotal);
                }
                if (discount != null)
                    receipt.addDiscount(discount);
            }
        }
    }
}
