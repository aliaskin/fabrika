-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('admin', 'teacher', 'student');

-- CreateEnum
CREATE TYPE "public"."AssignmentStatus" AS ENUM ('assigned', 'in_progress', 'completed', 'checked');

-- CreateTable
CREATE TABLE "public"."CmsEntry" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CmsEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Winner" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "rank" TEXT,
    "photoUrl" TEXT,
    "note" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Winner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FormSubmission" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "grade" TEXT,
    "role" TEXT,
    "message" TEXT,
    "sourcePage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserAccount" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "fullName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Assignment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "className" TEXT,
    "teacherId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudentAssignment" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "public"."AssignmentStatus" NOT NULL DEFAULT 'assigned',
    "score" DOUBLE PRECISION,
    "feedback" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExamResult" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "examName" TEXT NOT NULL,
    "examDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "correct" INTEGER NOT NULL,
    "wrong" INTEGER NOT NULL,
    "empty" INTEGER NOT NULL,
    "net" DOUBLE PRECISION NOT NULL,
    "weakTopics" TEXT,
    "advice" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudyPlan" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "actor" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "meta" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CmsEntry_key_key" ON "public"."CmsEntry"("key");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_username_key" ON "public"."UserAccount"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_email_key" ON "public"."UserAccount"("email");

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentAssignment" ADD CONSTRAINT "StudentAssignment_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "public"."Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentAssignment" ADD CONSTRAINT "StudentAssignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExamResult" ADD CONSTRAINT "ExamResult_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudyPlan" ADD CONSTRAINT "StudyPlan_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

