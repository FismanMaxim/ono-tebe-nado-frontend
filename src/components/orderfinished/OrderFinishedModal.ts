import { DialogWindowView, PopupDialogWindowManager } from '../../utils/PopupDialogWindowManager';
import { EventEmitter } from '../base/events';
import { ILot } from '../../types';

export class OrderFinishedModal extends DialogWindowView {
	private static instance: OrderFinishedModal;
	private orderLots: ILot[];

	static createInstance(container: HTMLElement, events: EventEmitter) {
		if (this.instance) throw new Error();
		this.instance = new OrderFinishedModal(container, events);
		return this.instance;
	}

	static getInstance() {
		if (!this.instance) throw new Error();
		return this.instance;
	}

	private constructor(container: HTMLElement, private events: EventEmitter) {
		super(container);

		(container.querySelector(".state__action") as HTMLButtonElement).onclick = () => {
			PopupDialogWindowManager.getInstance().closeCurrentWindow();
		}
	}

	render() {
		this.events.trigger("order-finished")();
		return this.container;
	}
}