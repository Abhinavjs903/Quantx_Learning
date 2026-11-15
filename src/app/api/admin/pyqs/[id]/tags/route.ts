import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/pyqs/[id]/tags
 * Returns all topics currently tagged to the given PYQ question.
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id: pyqId } = await params;

    if (!pyqId) {
      return NextResponse.json(
        { success: false, error: "PYQ ID is required" },
        { status: 400 }
      );
    }

    const pyq = await prisma.pYQ.findUnique({
      where: { id: pyqId },
    });

    if (!pyq) {
      return NextResponse.json(
        { success: false, error: "PYQ not found" },
        { status: 404 }
      );
    }

    const questionTopics = await prisma.questionTopic.findMany({
      where: { questionId: pyqId },
      include: {
        topic: true,
      },
    });

    const topics = questionTopics.map((qt) => qt.topic).filter(Boolean);

    return NextResponse.json(
      {
        success: true,
        data: topics,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching PYQ tags:", error);
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
 * POST /api/admin/pyqs/[id]/tags
 * Tags or untags a PYQ question with topics.
 * Accepts: { topicIds: string[] }
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id: pyqId } = await params;

    if (!pyqId) {
      return NextResponse.json(
        { success: false, error: "PYQ ID is required" },
        { status: 400 }
      );
    }

    const pyq = await prisma.pYQ.findUnique({
      where: { id: pyqId },
    });

    if (!pyq) {
      return NextResponse.json(
        { success: false, error: "PYQ not found" },
        { status: 404 }
      );
    }

    const body = await request.json().catch(() => null);

    if (!body || !Array.isArray(body.topicIds)) {
      return NextResponse.json(
        {
          success: false,
          error: "topicIds must be an array of strings",
        },
        { status: 400 }
      );
    }

    // Ensure all items are strings and remove duplicates
    const topicIds: string[] = Array.from(
      new Set(
        body.topicIds
          .filter(
            (tid: unknown): tid is string =>
              typeof tid === "string" && tid.trim() !== ""
          )
          .map((tid: string) => tid.trim())
      )
    );

    // If topicIds provided, validate that they exist and belong to the same subject as the PYQ
    let validatedTopics: { id: string; name: string; subjectId: string }[] = [];
    if (topicIds.length > 0) {
      validatedTopics = await prisma.topic.findMany({
        where: {
          id: { in: topicIds },
        },
        select: {
          id: true,
          name: true,
          subjectId: true,
        },
      });

      if (validatedTopics.length !== topicIds.length) {
        return NextResponse.json(
          {
            success: false,
            error: "One or more topic IDs do not exist",
          },
          { status: 400 }
        );
      }

      // Check subject scoping: all topics must belong to this PYQ's subject
      const invalidSubjectTopics = validatedTopics.filter(
        (t) => t.subjectId !== pyq.subjectId
      );

      if (invalidSubjectTopics.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Topics must belong to the same subject as the PYQ. Invalid topics: ${invalidSubjectTopics
              .map((t) => t.name)
              .join(", ")}`,
          },
          { status: 400 }
        );
      }
    }

    // Update tags: remove old tags and insert new tags
    await prisma.questionTopic.deleteMany({
      where: { questionId: pyqId },
    });

    if (topicIds.length > 0) {
      await prisma.questionTopic.createMany({
        data: topicIds.map((topicId) => ({
          questionId: pyqId,
          topicId,
        })),
        skipDuplicates: true,
      });
    }

    // Keep topicTags text field updated with topic names
    const topicNamesString = validatedTopics.map((t) => t.name).join(", ");
    await prisma.pYQ.update({
      where: { id: pyqId },
      data: {
        topicTags: topicNamesString || null,
      },
    });

    // Fetch the updated topics with full details
    const updatedQuestionTopics = await prisma.questionTopic.findMany({
      where: { questionId: pyqId },
      include: {
        topic: true,
      },
    });

    const currentTopics = updatedQuestionTopics
      .map((qt) => qt.topic)
      .filter(Boolean);

    return NextResponse.json(
      {
        success: true,
        message: "Question topics updated successfully",
        data: {
          questionId: pyqId,
          topics: currentTopics,
          topicTags: topicNamesString || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error tagging PYQ:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
