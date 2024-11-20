import './scss/styles.scss';

import { AuctionAPI } from './components/AuctionAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { ILot } from './types';
import { EventEmitter } from './components/base/events';
import { LotsListView } from './components/lotslist/LotsListView';
import { MakeBidView } from './components/makebid/MakeBidView';
import { PopupDialogWindowManager } from './utils/PopupDialogWindowManager';
import { CartModalManager } from './components/cart/CartModalManager';
import { ClosedBidsView } from './components/cart/ClosedBidsView';
import { ContactsModal } from './components/buymodel/ContactsModal';
import { AuctionOrder, AuctionOrderBuilder } from './utils/AuctionOrder';
import { OrderFinishedModal } from './components/orderfinished/OrderFinishedModal';
import { ActiveBidsView } from './components/cart/ActiveBidsView';
import { EmptyStateView } from './components/cart/EmptyStateView';

const api = new AuctionAPI(CDN_URL, API_URL);

let bidsList: ILot[];
let myCart: ILot[] = [];
let orderBuilder: AuctionOrderBuilder = new AuctionOrderBuilder();

function closeModal() {
	PopupDialogWindowManager.getInstance().closeCurrentWindow();
}

function acceptBid(lotId: string, amount: number) {
	const lot = bidsList.find(l => l.id == lotId);
	lot.history.push(amount);

	if (myCart.find(el => el.id == lot.id) == undefined) {
		myCart.push(lot);
	}

	console.log('New bid: ' + amount);
}

function handleBidWon(lotId: string, amount: number) {
	const lot = bidsList.find(l => l.id == lotId);
	lot.status = 'closed';

	console.log('Big won: ', lotId, ' for ', amount);

}

// Create singleton views
LotsListView.createInstance(document.querySelector('.catalog') as HTMLElement, new EventEmitter(
	['make-bid', (lot: ILot) => {
		PopupDialogWindowManager.getInstance().showWindow(MakeBidView.getInstance(), lot);
	}],
));

MakeBidView.createInstance(document.querySelector('#make-bid-modal') as HTMLElement, new EventEmitter(
	['close', closeModal],
	['bid-made', (data: { lotId: string, bidAmount: number }) => {
		acceptBid(data.lotId, data.bidAmount);
	}],
	['bid-won', (data: { lotId: string, bidAmount: number }) => {
		handleBidWon(data.lotId, data.bidAmount);
	}],
));

ClosedBidsView.createInstance(document.querySelector('#cart-closed') as HTMLElement, new EventEmitter(
	['make-order', (data: { orderLots: ILot[] }) => {
		orderBuilder.setLots(data.orderLots);
	}],
));

ActiveBidsView.createInstance(document.querySelector('#cart-active') as HTMLElement, new EventEmitter());
EmptyStateView.createInstance(document.querySelector('#cart-empty') as HTMLElement);

ContactsModal.createInstance(document.querySelector('#email-phone-modal') as HTMLElement, new EventEmitter(
	['accept-email-phone', (email: string, phone: string) => {
		orderBuilder.setEmail(email);
		orderBuilder.setPhone(phone);
	}],
));

OrderFinishedModal.createInstance(document.querySelector('#order-successful-modal') as HTMLElement, new EventEmitter(
	['order-finished', () => {
		const order: AuctionOrder = orderBuilder.build();
		const orderLotsIds = order.lots.map(lot => lot.id);

		myCart = myCart.filter(lot => !orderLotsIds.some(id => id === lot.id));

		console.log('Order finished');
		console.log(order);
		orderBuilder = new AuctionOrderBuilder();
	}],
));

function displayLots(lots: ILot[]) {
	LotsListView.getInstance().render(lots);
}

const events = new EventEmitter();
const cartModalManager = CartModalManager.createInstance(events);
document.querySelector('button.header__basket').addEventListener('click', () => {
	cartModalManager.open(myCart);
});

api.getLotList()
	.then(lots => {
		bidsList = lots;
		bidsList.forEach(lot => {
			if (!lot.history) lot.history = [];
		});

		displayLots(lots);
		console.log(lots);
	})
	.catch(err => {
		console.error(err);
	});


