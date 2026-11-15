import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/subjects/[id]
 * Fetches a single subject by ID with its semester, course, topics, and PYQs.
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
      include: {
        semester: {
          include: {
            course: true,
          },
        },
        topics: {
          include: {
            _count: {
              select: { questions: true },
            },
          },
          orderBy: { name: "asc" },
        },
        pyqs: {
          include: {
            topics: {
              include: {
                topic: true,
              },
            },
          },
          orderBy: { year: "desc" },
        },
        _count: {
          select: {
            topics: true,
            pyqs: true,
          },
        },
      },
    });

    if (!subject) {
      return NextResponse.json(
        { success: false, error: "Subject not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: subject,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching subject details:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
