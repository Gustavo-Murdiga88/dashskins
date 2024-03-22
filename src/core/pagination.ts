export interface IPagination<T> {
	totalElements: number;
	totalPages: number;
	data: T[];
}
