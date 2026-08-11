-- CreateTable
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "company" JSONB NOT NULL,
    "contactName" JSONB NOT NULL,
    "contactEmail" JSONB NOT NULL,
    "serviceLine" JSONB NOT NULL,
    "budgetNormalizedUSD" JSONB NOT NULL,
    "budgetRawText" JSONB NOT NULL,
    "timeline" JSONB NOT NULL,
    "summary" JSONB NOT NULL,
    "isGenuine" JSONB NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "extractionVersion" INTEGER NOT NULL DEFAULT 1,
    "lastError" TEXT,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);
