import authOptions from "@/app/auth/authOptions";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const headersList = headers();
  const userAgent = headersList.get["user-agent"];
  const referer = request.headers.referer;

  console.log("USER AGENT", userAgent);
  console.log("LIST", headersList);
  console.log("REFERER", referer);

  // console.log("REQUEST", request);
  // const session = await getServerSession(authOptions);
  // console.log("SESSION", session);
  // if (!session) return NextResponse.json({}, { status: 401 });

  const appointment = await prisma.appointment.findUnique({
    where: { id: params.id },
  });

  if (!appointment)
    return NextResponse.json({ error: "Invalid ID" }, { status: 404 });

  try {
    await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events/" + appointment.eventId,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + process.env.GOOGLE_BEARER_TOKEN,
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then(async (res) => {
        console.log("Event deleted", res);

        await prisma.appointment.delete({
          where: { id: appointment.id },
        });

        return NextResponse.json({});
      });
  } catch (err) {
    console.log("ERROR", err);
    return NextResponse.json(err);
  }
}
