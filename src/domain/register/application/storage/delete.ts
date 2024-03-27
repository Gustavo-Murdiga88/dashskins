export interface IDeleter {
	url: string;
}

export abstract class Deleter {
	abstract delete({ url }: IDeleter): Promise<void>;
}
