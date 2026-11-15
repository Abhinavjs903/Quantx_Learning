import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/subjects/[id]/topics
 * Lists all topics for a given subject.
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id: subjectId } = await params;

    if (!subjectId) {
      return NextResponse.json(
        { success: false, error: "Subject ID is required" },
        { status: 400 }
      );
    }

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
    });

    if (!subject) {
      return NextResponse.json(
        { success: false, error: "Subject not found" },
        { status: 404 }
      );
    }

    const topics = await prisma.topic.findMany({
      where: { subjectId },
      include: {
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(
      {
        success: true,
        data: topics,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching subject topics:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/subjects/[id]/topics
 * Creates a new topic for a given subject.
 * Enforces DB-level unique constraint on [name, subjectId].
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id: subjectId } = await params;

    if (!subjectId) {
      return NextResponse.json(
        { success: false, error: "Subject ID is required" },
        { status: 400 }
      );
    }

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
    });

    if (!subject) {
      return NextResponse.json(
        { success: false, error: "Subject not found" },
        { status: 404 }
      );
    }

    const body = await request.json().catch(() => null);

    if (!body || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: "Topic name is required" },
        { status: 400 }
      );
    }

    const name = body.name.trim();

    // Check for existing topic with same name (case-insensitive) under the same subject
    const existing = await prisma.topic.findFirst({
      where: {
        subjectId,
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "A topic with this name already exists in this subject",
        },
        { status: 409 }
      );
    }

    const topic = await prisma.topic.create({
      data: {
        name,
        subjectId,
      },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Topic created successfully",
        data: topic,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating subject topic:", error);

    // Handle Prisma unique constraint violation (P2002)
    const prismaError = error as { code?: string; message?: string };
    if (prismaError?.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: "A topic with this name already exists in this subject",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
