import {SupermarketCatalog} from "./SupermarketCatalog"
import {OffersByProduct, ShoppingCart} from "./ShoppingCart"
import {Product} from "./Product"
import {Receipt} from "./Receipt"
import {Offer} from "./Offer"
import {SpecialOfferType} from "./SpecialOfferType"
import BagOfOffers from './BagOfOffers';

/*
* Teller
* - managing the discounts
*
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
        theCart.handleOffers(receipt, this.bagOfOffers.getOffers(), this.catalog);

        return receipt;
    }
}
