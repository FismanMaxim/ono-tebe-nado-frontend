import { Component } from '../base/Component';
import { ILot } from '../../types';
import { TemplatesManager } from '../../utils/TemplatesManager';
import { LotCardPreview } from './LotCardPreview';
import { EventEmitter } from '../base/events';

export class LotsListView extends Component {
	private static instance: LotsListView;
	private static readonly LotCardTemplateId = 'card';

	private lotsContainer: HTMLElement;

	static createInstance(container: HTMLElement, events: EventEmitter) {
		if (this.instance) throw new Error();
		this.instance = new LotsListView(container, events);
	}

	static getInstance() {
		if (!this.instance) throw new Error();
		return this.instance;
	}

	private constructor(container: HTMLElement, private events: EventEmitter) {
		super(container);

		this.lotsContainer = container.querySelector(".catalog__items");
	}

	render(lots: ILot[]): HTMLElement {
		this.lotsContainer.innerHTML = '';

		lots.forEach(lot => {
			const lotContainer = TemplatesManager.fromTemplate(LotsListView.LotCardTemplateId);
			const lotView = new LotCardPreview(lotContainer, this.events);
			this.lotsContainer.append(lotView.render(lot));
		});

		return this.container;
	}
}