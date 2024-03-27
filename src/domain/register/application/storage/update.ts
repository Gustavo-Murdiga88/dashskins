export interface IUpload {
	name: string;
	body: Buffer;
	type: string;
}

export abstract class Updater {
	abstract update(upload: IUpload): Promise<void>;
}
