import { EventEmitter } from '../base/events';
import { ILot } from '../../types';
import { DateTimePrettyPrinter } from '../../utils/DateTimePrettyPrinter';
import { DialogWindowView } from '../../utils/PopupDialogWindowManager';

export class MakeBidView extends DialogWindowView {
	private static instance: MakeBidView;

	private readonly image: HTMLImageElement;
	private readonly timerText: HTMLSpanElement;
	private readonly statusText: HTMLSpanElement;
	private readonly bidInput: HTMLInputElement;
	private readonly bidButton: HTMLButtonElement;
	private readonly historyContainer: HTMLElement;
	private readonly historyList: HTMLUListElement;
	private readonly titleText: HTMLHeadingElement;
	private readonly descriptionTexts: NodeListOf<HTMLParagraphElement>;
	private readonly lotBid: HTMLFormElement;

	private displayedLot: ILot;
	private timerIntervalId: number | null = null;

	static createInstance(container: HTMLElement, events: EventEmitter) {
		if (this.instance) throw new Error();
		this.instance = new MakeBidView(container, events);
	}

	static getInstance(): MakeBidView {
		if (!this.instance) throw new Error();
		return this.instance;
	}

	private constructor(container: HTMLElement, private events: EventEmitter) {
		super(container);
		this.lotBid = container.querySelector('form.lot__bid');
		this.image = container.querySelector('.lot__image');
		this.timerText = container.querySelector('.lot__status-timer');
		this.statusText = container.querySelector('.lot__status-text');
		this.bidInput = container.querySelector('.form__input');
		this.bidButton = container.querySelector('.button');
		this.historyContainer = container.querySelector('.lot__history');
		this.historyList = container.querySelector('.lot__history-bids');
		this.titleText = container.querySelector('.lot__title');
		this.descriptionTexts = container.querySelectorAll('.lot__description');

		this.bidInput.addEventListener('input', this.handleBidInput.bind(this));

		this.bidButton.addEventListener('click', (event) => {
			event.preventDefault();
			const bidAmount = parseFloat(this.bidInput.value);

			if (this.displayedLot.history.length == 0 || bidAmount > this.displayedLot.history[this.displayedLot.history.length - 1]) {
				this.events.trigger('bid-made')({ lotId: this.displayedLot.id, bidAmount: bidAmount });
				this.renderBidsHistory(this.displayedLot.history);
				this.bidInput.value = '';
			} else {
				this.bidInput.value = 'Слишком мало!';
			}
		});

		this.updateBidButtonState(false);
	}

	private handleBidInput() {
		const bidStr = this.bidInput.value;
		const bidFloat = parseFloat(bidStr);

		this.updateBidButtonState(!isNaN(bidFloat));
	}

	private updateBidButtonState(enabled: boolean) {
		this.setDisabled(this.bidButton, !enabled);
	}

	private renderBidsHistory(bids: number[]) {
		this.historyList.innerHTML = '';

		if (bids) {
			bids.slice(Math.max(0, bids.length - 5), bids.length).forEach(bid => {
				const bidItem = document.createElement('li');
				this.toggleClass(bidItem, 'lot__history-item');
				this.setText(bidItem, bid.toString());
				this.historyList.appendChild(bidItem);
			});
		}
	}

	render(lot: ILot) {
		this.displayedLot = lot;

		this.setImage(this.image, lot.image);
		this.setText(this.titleText, lot.title);

		const lotDate = new Date(lot.datetime);

		switch (lot.status) {
			case 'wait':
				this.setText(this.statusText, 'До начала аукциона');
				this.setText(this.timerText, DateTimePrettyPrinter.printDifference(new Date(), lotDate));
				this.setHidden(this.historyContainer);
				this.setHidden(this.lotBid);

				this.startTimer(lotDate);

				break;

			case 'active':
				this.setText(this.timerText, DateTimePrettyPrinter.printDifference(new Date(), lotDate));
				this.setText(this.statusText, 'До закрытия лота');
				this.setVisible(this.historyContainer);
				this.setVisible(this.lotBid);

				this.startTimer(lotDate);
				this.renderBidsHistory(lot.history);
				break;

			case 'closed':
				this.setText(this.statusText, `Продано за ${lot.price} ₽`);
				this.setText(this.timerText, 'Аукцион завершен');
				this.setHidden(this.historyContainer);
				this.setHidden(this.lotBid);
				break;
		}

		// Remove placeholder description paragraphs
		this.descriptionTexts.forEach(desc => desc.remove());
		lot.about.split(' ').forEach(par => {
			const paragraph = document.createElement('p');
			this.toggleClass(paragraph, 'lot__description');
			this.setText(paragraph, par);
		});

		return this.container;
	}

	private startTimer(lotDate: Date) {
		this.timerIntervalId = window.setInterval(() => {
			const timeRemaining = DateTimePrettyPrinter.printDifference(new Date(), lotDate);
			this.setText(this.timerText, timeRemaining);

			if (timeRemaining === DateTimePrettyPrinter.zeroTime) {
				this.clearTimer();
			}
		}, 1000);
	}

	private clearTimer() {
		if (this.timerIntervalId !== null) {
			clearInterval(this.timerIntervalId);
			this.timerIntervalId = null;

			this.events.trigger('bid-won')(
				{
					lotId: this.displayedLot.id,
					bidAmount: this.displayedLot.history[this.displayedLot.history.length - 1],
				});
		}
	}
}
