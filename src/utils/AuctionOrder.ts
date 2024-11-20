import { ILot } from '../types';

// Data class
export class AuctionOrder {
	public readonly lots: ILot[];
	public readonly email: string;
	public readonly phone: string;

	constructor(lots: ILot[], email: string, phone: string) {
		this.lots = lots;
		this.email = email;
		this.phone = phone;
	}
}

export class AuctionOrderBuilder {
	private lots: ILot[];
	private email: string;
	private phone: string;

	setLots(lots: ILot[]) {
		this.lots = lots;
		return this;
	}

	setEmail(email: string) {
		this.email = email;
		return this;
	}

	setPhone(phone: string) {
		this.phone = phone;
		return this;
	}

	build() {
		return new AuctionOrder(this.lots, this.email, this.phone);
	}
}