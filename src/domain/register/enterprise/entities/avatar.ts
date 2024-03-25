import { randomUUID } from "crypto";

import { Entity } from "@/core/entity";

type AvatarProps = {
	id: string;
	url: string;
	userId: string;
};
export class Avatar extends Entity<AvatarProps> {
	protected constructor(props: { url: string; id: string; userId: string }) {
		super(props);
	}

	set url(url: string) {
		this.props.url = url;
	}

	get url() {
		return this.props.url;
	}

	get userId() {
		return this.props.userId;
	}

	get id() {
		return this.props.id;
	}

	static create({
		url,
		id,
		userId,
	}: {
		url?: string | null;
		id?: string;
		userId: string;
	}) {
		return new Avatar({ url: url ?? "", id: id ?? randomUUID(), userId });
	}
}
