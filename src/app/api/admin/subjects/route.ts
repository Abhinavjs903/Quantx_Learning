import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/admin/subjects
 * Lists all subjects for admin management with counts of topics and PYQs.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        semester: {
          include: {
            course: true,
          },
        },
        _count: {
          select: {
            pyqs: true,
            topics: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(
      {
        success: true,
        data: subjects,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching admin subjects:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
