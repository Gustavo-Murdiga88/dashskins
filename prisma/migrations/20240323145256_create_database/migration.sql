-- CreateEnum
CREATE TYPE "Role" AS ENUM ('EDIT', 'DELETE', 'ALL');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ALL',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avatars" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "url" TEXT,

    CONSTRAINT "avatars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "avatars_user_id_key" ON "avatars"("user_id");

-- AddForeignKey
ALTER TABLE "avatars" ADD CONSTRAINT "avatars_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
