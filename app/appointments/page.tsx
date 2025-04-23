import React from "react";
import Link from "next/link";
import { z } from "zod";
import * as dayjs from "dayjs";
import { MdModeEdit } from "react-icons/md";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";

import PageHeader from "../components/PageHeader";
import PageMain from "../components/PageMain";

const appointmentSchema = z.object({
  id: z.string(),
  appointmentEnd: z.string(),
  appointmentStart: z.string(),
  client: z.string(),
  description: z.string(),
  jewels: z.string(),
  place: z.string(),
  rate: z.string(),
  service: z.string(),
  completed: z.boolean(),
});

type Appointment = z.infer<typeof appointmentSchema>;

const AppointmentsPage = async () => {
  const session = await getServerSession(authOptions);

  const appointments = await prisma.appointment.findMany({
    where: { userId: session.user_id },
  });

  return (
    <>
      <PageHeader>
        Agendamentos
        <Link
          href="/appointments/new"
          className="rounded-md bg-violet-600 px-3.5 py-1.5 text-base font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
        >
          Novo Agendamento
        </Link>
      </PageHeader>
      {appointments.length !== 0 ? (
        <PageMain>
          <div className="grid sm:grid-cols-6 gap-3">
            {appointments.map((item) => (
              <div
                key={item.id}
                className="bg-white col-span-2 px-3 py-2 rounded-md shadow-md"
              >
                <div className="flex items-center justify-between border-b-2 pb-2 mb-3">
                  <p className="text-violet-800 mr-3">{item.client}</p>
                  {item.completed ? (
                    <span className="bg-green-500 text-white text-xs rounded-lg py-1 px-2.5 mr-auto">
                      Concluído
                    </span>
                  ) : (
                    <span className="bg-violet-500 text-white text-xs rounded-lg py-1 px-2.5 mr-auto">
                      Agendado
                    </span>
                  )}
                  <MdModeEdit className="text-violet-700" />
                </div>
                <div className="grid grid-cols-6 gap-3">
                  <div className="col-span-2">
                    <p className="text-xs uppercase font-bold text-violet-700">
                      Dia
                    </p>
                    <p className="text-lg font-light text-zinc-700">
                      {dayjs(item.appointmentStart).format("DD/MM")}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs uppercase font-bold text-violet-700">
                      Horário
                    </p>
                    <p className="text-lg font-light text-zinc-700">
                      {dayjs(item.appointmentStart).format("HH:mm")}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs uppercase font-bold text-violet-700">
                      Lucro
                    </p>
                    <p className="text-lg font-light text-zinc-700">
                      R$ {item.profit}
                    </p>
                  </div>
                  <div className="col-span-6">
                    <p className="text-xs uppercase font-bold text-violet-700">
                      Local
                    </p>
                    <p className="text-lg font-light text-zinc-700">
                      {item.place}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PageMain>
      ) : (
        <PageMain>Nenhum agendamento cadastrado.</PageMain>
      )}
    </>
  );
};

export default AppointmentsPage;
