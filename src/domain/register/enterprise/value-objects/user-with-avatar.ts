import { Entity } from "@/core/entity";

import { Avatar } from "../entities/avatar";

interface IUserWithAvatar {
	name: string;
	avatar: Avatar;
	age: number;
	email: string;
	role: "EDIT" | "DELETE" | "ALL";
	id: string;
}
export class UserAvatar extends Entity<IUserWithAvatar> {
	static create(props: IUserWithAvatar) {
		return new UserAvatar(props);
	}

	get url() {
		return this.props.avatar.url;
	}

	get name() {
		return this.props.name;
	}

	get email() {
		return this.props.email;
	}

	get role() {
		return this.props.role;
	}

	get age() {
		return this.props.age;
	}

	get id() {
		return this.props.id;
	}

	get avatarId() {
		return this.props.avatar.id;
	}
}
