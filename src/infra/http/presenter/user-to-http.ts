import { UserAvatar } from "@/domain/register/enterprise/value-objects/user-with-avatar";

export class UserMapper {
	static userAvatarToHTTP(raw: UserAvatar) {
		return {
			age: raw.age,
			email: raw.email,
			id: raw.id,
			name: raw.name,
			role: raw.role,
			avatar: {
				url: raw.url,
				id: raw.avatarId,
				userId: raw.id,
			},
		};
	}
}
