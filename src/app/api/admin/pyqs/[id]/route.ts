import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/pyqs/[id]
 * Fetches a single PYQ with its subject and current topics.
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
      include: {
        subject: {
          include: {
            semester: {
              include: {
                course: true,
              },
            },
          },
        },
        topics: {
          include: {
            topic: true,
          },
        },
      },
    });

    if (!pyq) {
      return NextResponse.json(
        { success: false, error: "PYQ not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: pyq,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching PYQ details:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
