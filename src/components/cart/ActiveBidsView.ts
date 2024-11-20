import { DialogWindowView, PopupDialogWindowManager } from '../../utils/PopupDialogWindowManager';
import { EventEmitter } from '../base/events';
import { CartModalManager } from './CartModalManager';
import { ILot } from '../../types';
import { TemplatesManager } from '../../utils/TemplatesManager';
import { MakeBidView } from '../makebid/MakeBidView';

export class ActiveBidsView extends DialogWindowView {
	private static instance: ActiveBidsView;
	private static readonly myBidTemplate = 'bid';
	private readonly basketContent: HTMLDivElement;

	static createInstance(container: HTMLElement, events: EventEmitter) {
		if (this.instance) throw new Error();
		this.instance = new ActiveBidsView(container, events);
	}

	static getInstance() {
		if (!this.instance) throw new Error();
		return this.instance;
	}

	private constructor(container: HTMLElement, private events: EventEmitter) {
		super(container);
		this.basketContent = container.querySelector('.basket');

		container.querySelector('#cart-active-closed').addEventListener('click', () => {
			CartModalManager.getInstance().showView(false);
		});
	}

	render(lots: ILot[]) {
		this.basketContent.innerHTML = '';

		for (const lot of lots) {
			const newBid = TemplatesManager.fromTemplate(ActiveBidsView.myBidTemplate);
			(newBid.querySelector('.bid__image') as HTMLImageElement).src = lot.image;
			(newBid.querySelector('.bid__title') as HTMLHeadingElement).textContent = lot.title;
			if (lot.history != null && lot.history.length > 0)
				(newBid.querySelector('.bid__amount') as HTMLHeadingElement).textContent = lot.history[lot.history.length - 1].toString();
			(newBid.querySelector('.bid__open') as HTMLButtonElement).onclick = () => {
				PopupDialogWindowManager.getInstance().showWindow(MakeBidView.getInstance(), lot);
			};

			this.basketContent.append(newBid);
		}

		return this.container;
	}
}
