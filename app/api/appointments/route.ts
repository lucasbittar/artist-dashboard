import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/client";

const createAppointmentSchema = z.object({
  appointmentStart: z.string(),
  appointmentEnd: z.string(),
  client: z.string().min(1),
  description: z.string(),
  jewels: z.string().min(1),
  place: z.string().min(1),
  rate: z.string().min(1),
  service: z.string().min(1),
  total: z.string().min(1),
  profit: z.string().min(1),
  eventId: z.string().min(1).optional(),
  userId: z.string().min(1).optional(),
});

export async function GET(request) {
  console.log("BODY", request.params);
  const appointments = await prisma.appointment.findMany();

  return new Response(JSON.stringify(appointments));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = createAppointmentSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const newAppointment = await prisma.appointment.create({
    data: {
      appointmentEnd: body.appointmentEnd,
      appointmentStart: body.appointmentStart,
      client: body.client,
      description: body.description,
      jewels: body.jewels,
      place: body.place,
      rate: body.rate,
      service: body.service,
      total: body.total,
      profit: body.profit,
      eventId: body.eventId,
      userId: body.userId,
    },
  });

  return NextResponse.json(newAppointment, { status: 201 });
}
