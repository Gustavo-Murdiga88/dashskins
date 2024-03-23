import { Avatar as PrismaAvatar, User } from "@prisma/client";

import { Avatar } from "@/domain/register/enterprise/entities/avatar";
import { UserAvatar } from "@/domain/register/enterprise/value-objects/user-with-avatar";

export class PrismaUserMapper {
	static userAvatarToDomain({
		avatar,
		user,
	}: {
		user: User;
		avatar: PrismaAvatar | null;
	}) {
		return UserAvatar.create({
			age: user.age,
			email: user.email,
			id: user.id,
			name: user.name,
			role: user.role,
			avatar: !avatar
				? Avatar.create({ userId: user.id })
				: Avatar.create({
						url: avatar?.url,
						userId: user.id,
						id: avatar.id,
					}),
		});
	}
}
