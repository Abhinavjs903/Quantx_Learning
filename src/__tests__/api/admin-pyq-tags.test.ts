/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import {
  GET as getPYQTags,
  POST as tagPYQ,
} from "@/app/api/admin/pyqs/[id]/tags/route";
import prisma from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  default: {
    pYQ: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    topic: {
      findMany: vi.fn(),
    },
    questionTopic: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
  },
  prisma: {
    pYQ: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    topic: {
      findMany: vi.fn(),
    },
    questionTopic: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
  },
}));

describe("PYQ Topic Tagging API (/api/admin/pyqs/[id]/tags)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/admin/pyqs/[id]/tags", () => {
    it("returns 404 if the PYQ question paper does not exist", async () => {
      vi.mocked(prisma.pYQ.findUnique).mockResolvedValue(null);

      const req = new NextRequest(
        "http://localhost/api/admin/pyqs/pyq-404/tags"
      );
      const res = await getPYQTags(req, {
        params: Promise.resolve({ id: "pyq-404" }),
      });

      expect(res.status).toBe(404);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toBe("PYQ not found");
    });

    it("returns 200 with currently tagged topics", async () => {
      vi.mocked(prisma.pYQ.findUnique).mockResolvedValue({
        id: "pyq-1",
        subjectId: "sub-1",
        year: 2023,
      } as any);

      vi.mocked(prisma.questionTopic.findMany).mockResolvedValue([
        {
          id: "qt-1",
          questionId: "pyq-1",
          topicId: "top-1",
          topic: {
            id: "top-1",
            name: "Recursion",
            subjectId: "sub-1",
          },
        },
      ] as any);

      const req = new NextRequest("http://localhost/api/admin/pyqs/pyq-1/tags");
      const res = await getPYQTags(req, {
        params: Promise.resolve({ id: "pyq-1" }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data).toHaveLength(1);
      expect(json.data[0].name).toBe("Recursion");
    });
  });

  describe("POST /api/admin/pyqs/[id]/tags", () => {
    it("returns 400 when body does not contain an array of topicIds", async () => {
      vi.mocked(prisma.pYQ.findUnique).mockResolvedValue({
        id: "pyq-1",
        subjectId: "sub-1",
      } as any);

      const req = new NextRequest(
        "http://localhost/api/admin/pyqs/pyq-1/tags",
        {
          method: "POST",
          body: JSON.stringify({ topicIds: "invalid" }),
        }
      );
      const res = await tagPYQ(req, {
        params: Promise.resolve({ id: "pyq-1" }),
      });

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toContain("must be an array");
    });

    it("returns 404 when PYQ is not found", async () => {
      vi.mocked(prisma.pYQ.findUnique).mockResolvedValue(null);

      const req = new NextRequest(
        "http://localhost/api/admin/pyqs/pyq-missing/tags",
        {
          method: "POST",
          body: JSON.stringify({ topicIds: ["top-1"] }),
        }
      );
      const res = await tagPYQ(req, {
        params: Promise.resolve({ id: "pyq-missing" }),
      });

      expect(res.status).toBe(404);
      const json = await res.json();
      expect(json.error).toBe("PYQ not found");
    });

    it("returns 400 when tagging with a topic that belongs to a different subject", async () => {
      vi.mocked(prisma.pYQ.findUnique).mockResolvedValue({
        id: "pyq-1",
        subjectId: "sub-cs",
      } as any);

      // Return a topic that belongs to sub-math instead of sub-cs
      vi.mocked(prisma.topic.findMany).mockResolvedValue([
        {
          id: "top-calculus",
          name: "Calculus",
          subjectId: "sub-math",
        },
      ] as any);

      const req = new NextRequest(
        "http://localhost/api/admin/pyqs/pyq-1/tags",
        {
          method: "POST",
          body: JSON.stringify({ topicIds: ["top-calculus"] }),
        }
      );
      const res = await tagPYQ(req, {
        params: Promise.resolve({ id: "pyq-1" }),
      });

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toContain(
        "Topics must belong to the same subject as the PYQ"
      );
    });

    it("successfully tags multiple topics to a PYQ question and updates topicTags", async () => {
      vi.mocked(prisma.pYQ.findUnique).mockResolvedValue({
        id: "pyq-1",
        subjectId: "sub-cs",
      } as any);

      vi.mocked(prisma.topic.findMany).mockResolvedValue([
        { id: "top-1", name: "Dynamic Programming", subjectId: "sub-cs" },
        { id: "top-2", name: "Greedy Algorithms", subjectId: "sub-cs" },
      ] as any);

      vi.mocked(prisma.questionTopic.deleteMany).mockResolvedValue({
        count: 1,
      } as any);
      vi.mocked(prisma.questionTopic.createMany).mockResolvedValue({
        count: 2,
      } as any);
      vi.mocked(prisma.pYQ.update).mockResolvedValue({} as any);

      vi.mocked(prisma.questionTopic.findMany).mockResolvedValue([
        {
          id: "qt-1",
          questionId: "pyq-1",
          topicId: "top-1",
          topic: {
            id: "top-1",
            name: "Dynamic Programming",
            subjectId: "sub-cs",
          },
        },
        {
          id: "qt-2",
          questionId: "pyq-1",
          topicId: "top-2",
          topic: {
            id: "top-2",
            name: "Greedy Algorithms",
            subjectId: "sub-cs",
          },
        },
      ] as any);

      const req = new NextRequest(
        "http://localhost/api/admin/pyqs/pyq-1/tags",
        {
          method: "POST",
          body: JSON.stringify({ topicIds: ["top-1", "top-2"] }),
        }
      );
      const res = await tagPYQ(req, {
        params: Promise.resolve({ id: "pyq-1" }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.topics).toHaveLength(2);
      expect(json.data.topicTags).toBe(
        "Dynamic Programming, Greedy Algorithms"
      );

      // Verify deletion of old topics and creation of new topics
      expect(prisma.questionTopic.deleteMany).toHaveBeenCalledWith({
        where: { questionId: "pyq-1" },
      });
      expect(prisma.questionTopic.createMany).toHaveBeenCalledWith({
        data: [
          { questionId: "pyq-1", topicId: "top-1" },
          { questionId: "pyq-1", topicId: "top-2" },
        ],
        skipDuplicates: true,
      });
      expect(prisma.pYQ.update).toHaveBeenCalledWith({
        where: { id: "pyq-1" },
        data: { topicTags: "Dynamic Programming, Greedy Algorithms" },
      });
    });

    it("successfully untags a PYQ question when sending an empty array", async () => {
      vi.mocked(prisma.pYQ.findUnique).mockResolvedValue({
        id: "pyq-1",
        subjectId: "sub-cs",
      } as any);

      vi.mocked(prisma.questionTopic.deleteMany).mockResolvedValue({
        count: 2,
      } as any);
      vi.mocked(prisma.pYQ.update).mockResolvedValue({} as any);
      vi.mocked(prisma.questionTopic.findMany).mockResolvedValue([]);

      const req = new NextRequest(
        "http://localhost/api/admin/pyqs/pyq-1/tags",
        {
          method: "POST",
          body: JSON.stringify({ topicIds: [] }),
        }
      );
      const res = await tagPYQ(req, {
        params: Promise.resolve({ id: "pyq-1" }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.topics).toHaveLength(0);
      expect(json.data.topicTags).toBeNull();
      expect(prisma.questionTopic.deleteMany).toHaveBeenCalledWith({
        where: { questionId: "pyq-1" },
      });
      expect(prisma.pYQ.update).toHaveBeenCalledWith({
        where: { id: "pyq-1" },
        data: { topicTags: null },
      });
    });
  });
});
