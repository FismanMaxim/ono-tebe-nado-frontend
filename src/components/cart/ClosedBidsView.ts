import { DialogWindowView, PopupDialogWindowManager } from '../../utils/PopupDialogWindowManager';
import { EventEmitter } from '../base/events';
import { CartModalManager } from './CartModalManager';
import { ILot } from '../../types';
import { TemplatesManager } from '../../utils/TemplatesManager';
import { ContactsModal } from '../buymodel/ContactsModal';

export class ClosedBidsView extends DialogWindowView {
	private static instance: ClosedBidsView;
	private static readonly soldBidTemplate = 'sold';
	private readonly basketContent: HTMLDivElement;
	private readonly buyButton: HTMLButtonElement;

	private displayedLots: Map<ILot, boolean> = new Map<ILot, boolean>();

	static createInstance(container: HTMLElement, events: EventEmitter) {
		if (this.instance) throw new Error();
		this.instance = new ClosedBidsView(container, events);
	}

	static getInstance() {
		if (!this.instance) throw new Error();
		return this.instance;
	}

	private constructor(container: HTMLElement, private events: EventEmitter) {
		super(container);
		this.basketContent = container.querySelector('.basket__list');
		this.buyButton = container.querySelector('.basket__action');

		container.querySelector('#cart-closed-active').addEventListener('click', () => {
			CartModalManager.getInstance().showView(true);
		});

		this.buyButton.addEventListener('click', (e) => {
			e.preventDefault()
			events.trigger('make-order')({orderLots: this.getSelectedLots()});

			PopupDialogWindowManager.getInstance().showWindow(ContactsModal.getInstance());
		});

		this.updateBuyButtonEnable();
	}

	private updateBuyButtonEnable() {
		this.buyButton.disabled = this.getSelectedLots().length == 0;
	}

	private getSelectedLots() {
		const activeLots: ILot[] = [];
		for (const lot of this.displayedLots.keys()) {
			if (this.displayedLots.get(lot)) {
				activeLots.push(lot);
			}
		}
		return activeLots;
	}

	render(lots: ILot[]) {
		this.basketContent.innerHTML = '';

		this.displayedLots = new Map<ILot, boolean>(lots.map(lot => [lot, false]));

		this.container.querySelector('.basket__total').textContent =
			lots
				.map(l => l.history[l.history.length - 1])
				.reduce((previousValue, currentValue) => previousValue + currentValue, 0)
				.toString();

		for (const lot of lots) {
			const newBid = TemplatesManager.fromTemplate(ClosedBidsView.soldBidTemplate);
			(newBid.querySelector('.bid__image') as HTMLImageElement).src = lot.image;
			(newBid.querySelector('.bid__title') as HTMLHeadingElement).textContent = lot.title;
			if (lot.history != null && lot.history.length > 0)
				(newBid.querySelector('.bid__amount') as HTMLHeadingElement).textContent = lot.history[lot.history.length - 1].toString();
			(newBid.querySelector('.bid__selector-input') as HTMLInputElement).onclick = () => {
				this.displayedLots.set(lot, !this.displayedLots.get(lot));
				this.updateBuyButtonEnable();
			};

			this.basketContent.append(newBid);
		}

		return this.container;
	}
}
