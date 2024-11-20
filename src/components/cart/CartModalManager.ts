import { EventEmitter } from '../base/events';
import { ActiveBidsView } from './ActiveBidsView';
import { ClosedBidsView } from './ClosedBidsView';
import { EmptyStateView } from './EmptyStateView';
import { PopupDialogWindowManager } from '../../utils/PopupDialogWindowManager';
import { IAuction } from '../../types';

export class CartModalManager {
	private static instance: CartModalManager;
	private auctions: IAuction[];

	static createInstance(events: EventEmitter) {
		if (this.instance != null) throw new Error();

		this.instance = new CartModalManager(events);
		return this.instance;
	}

	static getInstance() {
		if (this.instance == null) throw new Error();

		return this.instance;
	}

	private constructor(private events: EventEmitter) {
		this.bindTabSwitching();
	}

	private bindTabSwitching() {
		this.events.on('show-active-bids', () => this.showView(true));
		this.events.on('show-closed-bids', () => this.showView(false));
	}

	open(auctions: IAuction[]) {
		this.auctions = auctions;
		this.showView(true);
	}

	showView(active: boolean) {
		if (this.auctions.length == 0) {
			PopupDialogWindowManager.getInstance().showWindow(EmptyStateView.getInstance());
		} else {
			if (active) {
				PopupDialogWindowManager.getInstance().showWindow(ActiveBidsView.getInstance(), this.auctions.filter(auc => auc.status == 'active'));
			} else {
				PopupDialogWindowManager.getInstance().showWindow(ClosedBidsView.getInstance(), this.auctions.filter(auc => auc.status == 'closed'));
			}
		}
	}
}
