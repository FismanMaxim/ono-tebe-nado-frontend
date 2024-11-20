export class DateTimePrettyPrinter {
	public static zeroTime = '0д 00ч 00 мин 00 сек';

	static printDifference(date1: Date, date2: Date): string {
		let diffInMs = date2.getTime() - date1.getTime();
		if (diffInMs < 0) return this.zeroTime;
		else diffInMs = Math.abs(diffInMs);

		const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
		diffInMs -= days * (1000 * 60 * 60 * 24);

		const hours = Math.floor(diffInMs / (1000 * 60 * 60));
		diffInMs -= hours * (1000 * 60 * 60);

		const minutes = Math.floor(diffInMs / (1000 * 60));
		diffInMs -= minutes * (1000 * 60);

		const seconds = Math.floor(diffInMs / 1000);

		return `${days}д ${String(hours).padStart(2, '0')}ч ${String(minutes).padStart(2, '0')} мин ${String(seconds).padStart(2, '0')} сек`;
	}

	static formatDateTime(isoString: string): string {
		const date = new Date(isoString);
		const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
		const day = date.getDate();
		const month = months[date.getMonth()];
		const year = date.getFullYear();
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		return `${day} ${month} ${year} ${hours}:${minutes}`;
	}
}
