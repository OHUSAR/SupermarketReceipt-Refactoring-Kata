import { OffersByProduct } from './ShoppingCart';
import { SupermarketCatalog } from './SupermarketCatalog';
import { SpecialOfferType } from './SpecialOfferType';
import { Product } from './Product';
import { Offer } from './Offer';

class BagOfOffers {
    private _offers: OffersByProduct = {};

    public addSpecialOffer(offerType: SpecialOfferType , product: Product, argument: number): void {
        this._offers[product.name] = new Offer(offerType, product, argument);
    }

    public getOffers(): OffersByProduct {
        return this._offers;
    }

}

export default BagOfOffers;
