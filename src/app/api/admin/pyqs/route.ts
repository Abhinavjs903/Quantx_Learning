import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/admin/pyqs
 * Lists PYQs, optionally filtered by subjectId.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const subjectId = searchParams.get("subjectId");

    const where: Record<string, unknown> = {};
    if (subjectId) {
      where.subjectId = subjectId;
    }

    const pyqs = await prisma.pYQ.findMany({
      where,
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        topics: {
          include: {
            topic: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      {
        success: true,
        data: pyqs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching admin PYQs:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
