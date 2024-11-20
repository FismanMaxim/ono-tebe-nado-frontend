import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { ILot } from '../../types';
import { DateTimePrettyPrinter } from '../../utils/DateTimePrettyPrinter';

export class LotCardPreview extends Component {
	private titleText: HTMLHeadingElement;
	private descriptionText: HTMLParagraphElement;
	private image: HTMLImageElement;
	private makeBidBtn: HTMLButtonElement;
	private statusText: HTMLSpanElement;
	private displayedLot: ILot;

	constructor(container: HTMLElement, events: EventEmitter) {
		super(container);

		this.titleText = container.querySelector('.card__title');
		this.descriptionText = container.querySelector('.card__description');
		this.image = container.querySelector('.card__image');
		this.makeBidBtn = container.querySelector('.card__action');
		this.statusText = container.querySelector('.card__status');

		this.makeBidBtn.addEventListener('click', () => {
			events.trigger('make-bid')(this.displayedLot);
		});
	}

	render(lot: ILot) {
		this.displayedLot = lot;

		this.setText(this.titleText, lot.title);
		this.setText(this.descriptionText, lot.about);
		this.setImage(this.image, lot.image);

		switch (lot.status) {
			case 'wait':
				this.setText(this.statusText, 'Откроется ' + DateTimePrettyPrinter.formatDateTime(lot.datetime));
				this.toggleClass(this.statusText, 'card__status_before');
				break;
			case 'active':
				this.setText(this.statusText, 'Открыт до ' + DateTimePrettyPrinter.formatDateTime(lot.datetime));
				this.toggleClass(this.statusText, 'card__status_active');
				break;
			case 'closed':
				this.setText(this.statusText, 'Закрыто ' + DateTimePrettyPrinter.formatDateTime(lot.datetime));
				this.toggleClass(this.statusText, 'card__status_closed');
				break;
		}

		return this.container;
	}
}
