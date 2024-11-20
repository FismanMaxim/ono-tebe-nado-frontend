import { DialogWindowView, PopupDialogWindowManager } from '../../utils/PopupDialogWindowManager';
import { EventEmitter } from '../base/events';
import { OrderFinishedModal } from '../orderfinished/OrderFinishedModal';

export class ContactsModal extends DialogWindowView {
	private static instance: ContactsModal;

	private emailInput: HTMLInputElement;
	private phoneInput: HTMLInputElement;
	private nextButton: HTMLButtonElement;

	static createInstance(container: HTMLElement, events: EventEmitter) {
		if (this.instance) throw new Error();
		this.instance = new ContactsModal(container, events);
		return this.instance;
	}

	static getInstance() {
		if (!this.instance) throw new Error();
		return this.instance;
	}

	private constructor(container: HTMLElement, private events: EventEmitter) {
		super(container);

		this.emailInput = container.querySelector('#email-input');
		this.phoneInput = container.querySelector('#phone-input');
		this.nextButton = container.querySelector('.form__footer .button');

		this.emailInput.addEventListener('input', () => this.updateNextButtonEnable());
		this.phoneInput.addEventListener('input', () => this.updateNextButtonEnable());

		container.querySelector('form').addEventListener('submit', event => {
			event.preventDefault();

			events.trigger('accept-email-phone')({ email: this.emailInput.value, phone: this.phoneInput.value });
			PopupDialogWindowManager.getInstance().showWindow(OrderFinishedModal.getInstance());
		});
	}

	private updateNextButtonEnable() {
		this.nextButton.disabled = (this.emailInput.value == '' || this.phoneInput.value == '');
	}

	render(data: object) {
		return super.render(data)
	}
}