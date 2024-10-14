/*
  Warnings:

  - You are about to drop the column `email` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `contacts` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_uuid` to the `contacts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - The required column `uuid` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_username_fkey";

-- AlterTable
ALTER TABLE "contacts" DROP COLUMN "email",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "username",
ADD COLUMN     "user_uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "name",
DROP COLUMN "username",
ADD COLUMN     "email" VARCHAR(255) NOT NULL,
ADD COLUMN     "first_name" VARCHAR(100) NOT NULL,
ADD COLUMN     "full_name" VARCHAR(100),
ADD COLUMN     "uuid" TEXT NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "email" ON "users"("email");

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
