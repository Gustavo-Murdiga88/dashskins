import { randomUUID } from "crypto";

import { Entity } from "@/core/entity";
import { Optional } from "@/core/optional";

import { Avatar } from "./avatar";

export type UserProps = {
	name: string;
	avatar: Avatar;
	age: number;
	email: string;
	role: "EDIT" | "DELETE" | "ALL";
	id: string;
};

export class User extends Entity<UserProps> {
	constructor(props: UserProps) {
		super(props);
	}

	get name() {
		return this.props.name;
	}

	get age() {
		return this.props.age;
	}

	get email() {
		return this.props.email;
	}

	get role() {
		return this.props.role;
	}

	get id() {
		return this.props.id;
	}

	get avatar() {
		return this.props.avatar;
	}

	set avatar(avatar: Avatar) {
		this.props.avatar = avatar;
	}

	static create({
		age,
		avatar,
		email,
		id,
		name,
		role,
	}: Optional<UserProps, "avatar" | "id">) {
		return new User({
			age,
			avatar:
				avatar || Avatar.create({ url: "", id: randomUUID(), userId: "" }),
			email,
			id: id || randomUUID(),
			name,
			role,
		});
	}
}
