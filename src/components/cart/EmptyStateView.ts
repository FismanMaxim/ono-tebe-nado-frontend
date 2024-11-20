import { DialogWindowView, PopupDialogWindowManager } from '../../utils/PopupDialogWindowManager';
import { CartModalManager } from './CartModalManager';
import { EventEmitter } from '../base/events';

export class EmptyStateView extends DialogWindowView {
	private static instance: EmptyStateView;
	private readonly toMainPageButton: HTMLButtonElement;
	private readonly cartEmptyClosed: HTMLButtonElement;
	private readonly cartEmptyActive: HTMLButtonElement;

	static createInstance(container: HTMLElement) {
		if (this.instance) throw new Error();
		this.instance = new EmptyStateView(container);
	}

	static getInstance() {
		if (!this.instance) throw new Error();
		return this.instance;
	}

	private constructor(container: HTMLElement) {
		super(container);
		this.toMainPageButton = container.querySelector('.state__action');

		this.toMainPageButton.addEventListener('click', () => window.location.href = '/');

		this.cartEmptyClosed = container.querySelector('#cart-empty-closed');
		this.cartEmptyActive = container.querySelector('#cart-empty-active');

		this.cartEmptyClosed.addEventListener('click', () => {
			CartModalManager.getInstance().showView(false);
			this.setActive(false);
		});
		this.cartEmptyActive.addEventListener('click', () => {
			CartModalManager.getInstance().showView(true);
			this.setActive(true);
		});
	}

	setActive(active: boolean) {
		this.toggleClass(this.cartEmptyActive, 'tabs__item_active');
		this.toggleClass(this.cartEmptyClosed, 'tabs__item_active');
		this.cartEmptyClosed.disabled = !active;
		this.cartEmptyActive.disabled = active;

	}
}
