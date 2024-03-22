import { randomUUID } from "crypto";

import { Entity } from "@/core/entity";

type AvatarProps = {
	id: string;
	url: string;
};
export class Avatar extends Entity<AvatarProps> {
	protected constructor(props: { url: string; id: string }) {
		super(props);
	}

	set imageURL(url: string) {
		this.props.url = url;
	}

	static create({ url, id }: { url: string; id?: string }) {
		return new Avatar({ url, id: id || randomUUID() });
	}
}
