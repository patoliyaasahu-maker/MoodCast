-- Extend reaction types
ALTER TYPE "ReactionType" ADD VALUE 'LAUGH';
ALTER TYPE "ReactionType" ADD VALUE 'SUPPORT';
ALTER TYPE "ReactionType" ADD VALUE 'RELATE';
ALTER TYPE "ReactionType" ADD VALUE 'WOW';

ALTER TYPE "CoinReason" ADD VALUE 'LAUGH_RECEIVED';
ALTER TYPE "CoinReason" ADD VALUE 'SUPPORT_RECEIVED';
ALTER TYPE "CoinReason" ADD VALUE 'RELATE_RECEIVED';
ALTER TYPE "CoinReason" ADD VALUE 'WOW_RECEIVED';

-- New reaction counts on posts
ALTER TABLE "Post" ADD COLUMN "laughCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Post" ADD COLUMN "supportCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Post" ADD COLUMN "relateCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Post" ADD COLUMN "wowCount" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "FeedPost" ADD COLUMN "laughCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "FeedPost" ADD COLUMN "supportCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "FeedPost" ADD COLUMN "relateCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "FeedPost" ADD COLUMN "wowCount" INTEGER NOT NULL DEFAULT 0;

-- Comments
CREATE TABLE "PostComment" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PostComment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FeedComment" (
    "id" TEXT NOT NULL,
    "feedPostId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FeedComment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PostComment_postId_createdAt_idx" ON "PostComment"("postId", "createdAt");
CREATE INDEX "FeedComment_feedPostId_createdAt_idx" ON "FeedComment"("feedPostId", "createdAt");

ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FeedComment" ADD CONSTRAINT "FeedComment_feedPostId_fkey" FOREIGN KEY ("feedPostId") REFERENCES "FeedPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FeedComment" ADD CONSTRAINT "FeedComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
