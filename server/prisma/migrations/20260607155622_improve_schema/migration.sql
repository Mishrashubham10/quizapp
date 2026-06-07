/*
  Warnings:

  - The primary key for the `Question` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `question` on the `Question` table. All the data in the column will be lost.
  - The primary key for the `QuizSession` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `isFinished` on the `QuizSession` table. All the data in the column will be lost.
  - The primary key for the `RoomMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `playerName` on the `RoomMember` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `PlayerScore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuizResult` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roomId,userId]` on the table `RoomMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `text` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `RoomMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuizStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'FINISHED');

-- DropForeignKey
ALTER TABLE "PlayerScore" DROP CONSTRAINT "PlayerScore_quizResultId_fkey";

-- DropForeignKey
ALTER TABLE "QuizSession" DROP CONSTRAINT "QuizSession_roomId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP CONSTRAINT "Question_pkey",
DROP COLUMN "question",
ADD COLUMN     "text" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Question_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Question_id_seq";

-- AlterTable
ALTER TABLE "QuizSession" DROP CONSTRAINT "QuizSession_pkey",
DROP COLUMN "isFinished",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "QuizStatus" NOT NULL DEFAULT 'NOT_STARTED',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "startedAt" DROP NOT NULL,
ALTER COLUMN "startedAt" DROP DEFAULT,
ADD CONSTRAINT "QuizSession_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "QuizSession_id_seq";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RoomMember" DROP CONSTRAINT "RoomMember_pkey",
DROP COLUMN "playerName",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "socketId" DROP NOT NULL,
ADD CONSTRAINT "RoomMember_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "RoomMember_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- DropTable
DROP TABLE "PlayerScore";

-- DropTable
DROP TABLE "QuizResult";

-- CreateTable
CREATE TABLE "QuizParticipant" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "correctAnswers" INTEGER NOT NULL DEFAULT 0,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuizParticipant_sessionId_idx" ON "QuizParticipant"("sessionId");

-- CreateIndex
CREATE INDEX "QuizParticipant_userId_idx" ON "QuizParticipant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "QuizParticipant_sessionId_userId_key" ON "QuizParticipant"("sessionId", "userId");

-- CreateIndex
CREATE INDEX "QuizSession_roomId_idx" ON "QuizSession"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "Room_code_key" ON "Room"("code");

-- CreateIndex
CREATE INDEX "Room_hostId_idx" ON "Room"("hostId");

-- CreateIndex
CREATE INDEX "RoomMember_roomId_idx" ON "RoomMember"("roomId");

-- CreateIndex
CREATE INDEX "RoomMember_userId_idx" ON "RoomMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomMember_roomId_userId_key" ON "RoomMember"("roomId", "userId");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomMember" ADD CONSTRAINT "RoomMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizSession" ADD CONSTRAINT "QuizSession_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizParticipant" ADD CONSTRAINT "QuizParticipant_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "QuizSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizParticipant" ADD CONSTRAINT "QuizParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
