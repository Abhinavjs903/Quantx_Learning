import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/topics/[id]
 * Fetches a single topic by ID.
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id: topicId } = await params;

    if (!topicId) {
      return NextResponse.json(
        { success: false, error: "Topic ID is required" },
        { status: 400 }
      );
    }

    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        _count: {
          select: { questions: true },
        },
      },
    });

    if (!topic) {
      return NextResponse.json(
        { success: false, error: "Topic not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: topic,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching topic:", error);
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
 * DELETE /api/admin/topics/[id]
 * Deletes a topic by ID. Cascades to QuestionTopic records via Prisma schema.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id: topicId } = await params;

    if (!topicId) {
      return NextResponse.json(
        { success: false, error: "Topic ID is required" },
        { status: 400 }
      );
    }

    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
    });

    if (!topic) {
      return NextResponse.json(
        { success: false, error: "Topic not found" },
        { status: 404 }
      );
    }

    await prisma.topic.delete({
      where: { id: topicId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Topic deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting topic:", error);
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
 * PATCH /api/admin/topics/[id]
 * Renames or updates a topic. Ensures uniqueness within the same subject.
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id: topicId } = await params;

    if (!topicId) {
      return NextResponse.json(
        { success: false, error: "Topic ID is required" },
        { status: 400 }
      );
    }

    const existingTopic = await prisma.topic.findUnique({
      where: { id: topicId },
    });

    if (!existingTopic) {
      return NextResponse.json(
        { success: false, error: "Topic not found" },
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

    const newName = body.name.trim();

    // Check if another topic in the same subject has this name
    const duplicate = await prisma.topic.findFirst({
      where: {
        subjectId: existingTopic.subjectId,
        id: { not: topicId },
        name: {
          equals: newName,
          mode: "insensitive",
        },
      },
    });

    if (duplicate) {
      return NextResponse.json(
        {
          success: false,
          error: "A topic with this name already exists in this subject",
        },
        { status: 409 }
      );
    }

    const updated = await prisma.topic.update({
      where: { id: topicId },
      data: { name: newName },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Topic updated successfully",
        data: updated,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating topic:", error);
    const prismaError = error as { code?: string };
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
