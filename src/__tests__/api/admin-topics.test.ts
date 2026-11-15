/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import {
  GET as getSubjectTopics,
  POST as createSubjectTopic,
} from "@/app/api/admin/subjects/[id]/topics/route";
import {
  GET as getTopic,
  PATCH as updateTopic,
  DELETE as deleteTopic,
} from "@/app/api/admin/topics/[id]/route";
import prisma from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  default: {
    subject: {
      findUnique: vi.fn(),
    },
    topic: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
  prisma: {
    subject: {
      findUnique: vi.fn(),
    },
    topic: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("Subject Topics API (/api/admin/subjects/[id]/topics)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/admin/subjects/[id]/topics", () => {
    it("returns 404 if the subject does not exist", async () => {
      vi.mocked(prisma.subject.findUnique).mockResolvedValue(null);

      const req = new NextRequest(
        "http://localhost/api/admin/subjects/sub-1/topics"
      );
      const res = await getSubjectTopics(req, {
        params: Promise.resolve({ id: "sub-1" }),
      });

      expect(res.status).toBe(404);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toBe("Subject not found");
    });

    it("returns 200 with list of topics when subject exists", async () => {
      vi.mocked(prisma.subject.findUnique).mockResolvedValue({
        id: "sub-1",
        name: "Data Structures",
        code: "ETCS-201",
        semesterId: "sem-3",
      } as any);

      vi.mocked(prisma.topic.findMany).mockResolvedValue([
        {
          id: "top-1",
          name: "Arrays",
          subjectId: "sub-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { questions: 3 },
        },
        {
          id: "top-2",
          name: "Linked Lists",
          subjectId: "sub-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { questions: 2 },
        },
      ] as any);

      const req = new NextRequest(
        "http://localhost/api/admin/subjects/sub-1/topics"
      );
      const res = await getSubjectTopics(req, {
        params: Promise.resolve({ id: "sub-1" }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data).toHaveLength(2);
      expect(json.data[0].name).toBe("Arrays");
    });
  });

  describe("POST /api/admin/subjects/[id]/topics", () => {
    it("returns 400 when topic name is empty or missing", async () => {
      vi.mocked(prisma.subject.findUnique).mockResolvedValue({
        id: "sub-1",
        name: "Data Structures",
      } as any);

      const req = new NextRequest(
        "http://localhost/api/admin/subjects/sub-1/topics",
        {
          method: "POST",
          body: JSON.stringify({ name: "   " }),
        }
      );
      const res = await createSubjectTopic(req, {
        params: Promise.resolve({ id: "sub-1" }),
      });

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toBe("Topic name is required");
    });

    it("returns 409 when topic name already exists in same subject (DB unique constraint)", async () => {
      vi.mocked(prisma.subject.findUnique).mockResolvedValue({
        id: "sub-1",
        name: "Data Structures",
      } as any);

      vi.mocked(prisma.topic.findFirst).mockResolvedValue({
        id: "top-existing",
        name: "Trees",
        subjectId: "sub-1",
      } as any);

      const req = new NextRequest(
        "http://localhost/api/admin/subjects/sub-1/topics",
        {
          method: "POST",
          body: JSON.stringify({ name: "Trees" }),
        }
      );
      const res = await createSubjectTopic(req, {
        params: Promise.resolve({ id: "sub-1" }),
      });

      expect(res.status).toBe(409);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("already exists");
    });

    it("returns 201 and creates topic cleanly", async () => {
      vi.mocked(prisma.subject.findUnique).mockResolvedValue({
        id: "sub-1",
        name: "Data Structures",
      } as any);

      vi.mocked(prisma.topic.findFirst).mockResolvedValue(null);

      const mockCreated = {
        id: "top-new",
        name: "Binary Search Trees",
        subjectId: "sub-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { questions: 0 },
      };
      vi.mocked(prisma.topic.create).mockResolvedValue(mockCreated as any);

      const req = new NextRequest(
        "http://localhost/api/admin/subjects/sub-1/topics",
        {
          method: "POST",
          body: JSON.stringify({ name: "Binary Search Trees" }),
        }
      );
      const res = await createSubjectTopic(req, {
        params: Promise.resolve({ id: "sub-1" }),
      });

      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.name).toBe("Binary Search Trees");
    });
  });
});

describe("Topic Detail & CRUD API (/api/admin/topics/[id])", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/admin/topics/[id]", () => {
    it("returns 404 when topic does not exist", async () => {
      vi.mocked(prisma.topic.findUnique).mockResolvedValue(null);

      const req = new NextRequest("http://localhost/api/admin/topics/top-404");
      const res = await getTopic(req, {
        params: Promise.resolve({ id: "top-404" }),
      });

      expect(res.status).toBe(404);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it("returns 200 when topic exists", async () => {
      vi.mocked(prisma.topic.findUnique).mockResolvedValue({
        id: "top-1",
        name: "Dynamic Programming",
        subjectId: "sub-1",
      } as any);

      const req = new NextRequest("http://localhost/api/admin/topics/top-1");
      const res = await getTopic(req, {
        params: Promise.resolve({ id: "top-1" }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data.name).toBe("Dynamic Programming");
    });
  });

  describe("DELETE /api/admin/topics/[id]", () => {
    it("returns 404 if topic not found", async () => {
      vi.mocked(prisma.topic.findUnique).mockResolvedValue(null);

      const req = new NextRequest(
        "http://localhost/api/admin/topics/top-missing",
        {
          method: "DELETE",
        }
      );
      const res = await deleteTopic(req, {
        params: Promise.resolve({ id: "top-missing" }),
      });

      expect(res.status).toBe(404);
    });

    it("returns 200 and deletes topic with cascade", async () => {
      vi.mocked(prisma.topic.findUnique).mockResolvedValue({
        id: "top-1",
        name: "Greedy Algorithms",
      } as any);
      vi.mocked(prisma.topic.delete).mockResolvedValue({ id: "top-1" } as any);

      const req = new NextRequest("http://localhost/api/admin/topics/top-1", {
        method: "DELETE",
      });
      const res = await deleteTopic(req, {
        params: Promise.resolve({ id: "top-1" }),
      });

      expect(res.status).toBe(200);
      expect(prisma.topic.delete).toHaveBeenCalledWith({
        where: { id: "top-1" },
      });
      const json = await res.json();
      expect(json.success).toBe(true);
    });
  });

  describe("PATCH /api/admin/topics/[id]", () => {
    it("returns 409 if renaming creates duplicate within same subject", async () => {
      vi.mocked(prisma.topic.findUnique).mockResolvedValue({
        id: "top-1",
        name: "Graph",
        subjectId: "sub-1",
      } as any);

      vi.mocked(prisma.topic.findFirst).mockResolvedValue({
        id: "top-2",
        name: "Graphs",
        subjectId: "sub-1",
      } as any);

      const req = new NextRequest("http://localhost/api/admin/topics/top-1", {
        method: "PATCH",
        body: JSON.stringify({ name: "Graphs" }),
      });
      const res = await updateTopic(req, {
        params: Promise.resolve({ id: "top-1" }),
      });

      expect(res.status).toBe(409);
      const json = await res.json();
      expect(json.error).toContain("already exists");
    });

    it("returns 200 and updates name successfully", async () => {
      vi.mocked(prisma.topic.findUnique).mockResolvedValue({
        id: "top-1",
        name: "Graph",
        subjectId: "sub-1",
      } as any);
      vi.mocked(prisma.topic.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.topic.update).mockResolvedValue({
        id: "top-1",
        name: "Graph Algorithms",
        subjectId: "sub-1",
      } as any);

      const req = new NextRequest("http://localhost/api/admin/topics/top-1", {
        method: "PATCH",
        body: JSON.stringify({ name: "Graph Algorithms" }),
      });
      const res = await updateTopic(req, {
        params: Promise.resolve({ id: "top-1" }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data.name).toBe("Graph Algorithms");
    });
  });
});
