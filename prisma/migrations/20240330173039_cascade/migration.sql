-- DropForeignKey
ALTER TABLE "avatars" DROP CONSTRAINT "avatars_user_id_fkey";

-- AddForeignKey
ALTER TABLE "avatars" ADD CONSTRAINT "avatars_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
