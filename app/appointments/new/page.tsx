"use client";
import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ImSpinner8 } from "react-icons/im";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import * as dayjs from "dayjs";
import { z } from "zod";

import "dayjs/locale/pt-br";

import PageHeader from "../../components/PageHeader";
import PageMain from "../../components/PageMain";
import { api } from "../../../lib/axios";

const appointmentSchema = z.object({
  client: z.string().min(3, { message: "Coloque um nome válido" }),
  description: z.string(),
  jewels: z.string(),
  place: z.string(),
  rate: z.string().min(1, { message: "Defina um valor correto" }),
  service: z.string().min(1, { message: "Defina um valor correto" }),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

const NewAppointmentPage = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  const [total, setTotal] = useState("0");
  const [profit, setProfit] = useState("0");
  const [startDateTime, setStartDateTime] = useState("0");
  const [endDateTime, setEndDateTime] = useState("0");

  const { data: session } = useSession();

  console.log("SESSION", session);

  useEffect(() => {
    const subscribe = watch((data) => {
      const service = parseInt(data.service) || 0;
      const rate = parseInt(data.rate) || 0;
      let totalJewels = 0;

      if (data.jewels !== "") {
        const jewels = data.jewels.split(",");
        totalJewels = jewels.reduce((a, b) => parseInt(a) + parseInt(b), 0);
      }

      const total = totalJewels + service;
      const profit = (total * rate) / 100;

      setTotal(total);
      setProfit(total - profit);
      setStartDateTime(dayjs(data.appointmentStart).format());
      setEndDateTime(dayjs(data.appointmentStart).add(1, "hour").format());
    });

    return () => {
      subscribe.unsubscribe();
    };
  }, [watch]);

  const router = useRouter();

  const createAppointment = async (data: AppointmentFormData) => {
    const googleCalendarEvent = {
      summary: `${data.client} @ ${data.place}`,
      description: data.description,
      start: {
        dateTime: dayjs(startDateTime).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: dayjs(endDateTime).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    try {
      await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + session.access_token,
          },
          body: JSON.stringify(googleCalendarEvent),
        }
      )
        .then((res) => {
          return res.json();
        })
        .then(async (res) => {
          console.log("Event created on Google Calendar.", res);

          await api.post("/appointments", {
            ...data,
            appointmentStart: startDateTime,
            appointmentEnd: endDateTime,
            total: total.toString(),
            profit: profit.toString(),
            userId: session.user_id,
            eventId: res.id,
          });

          await router.push("/appointments");
        });
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <PageHeader>Novo Agendamento</PageHeader>
        <PageMain>
          <form onSubmit={handleSubmit(createAppointment)}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-violet-900">
                  Detalhes do agendamento
                </h2>
                <p className="mt-1 text-sm leading-6 text-violet-100">
                  Preencha todos os campos para criar um novo agendamento.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-violet-900">
                      Nome do cliente
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        className="block w-full rounded-md border-0 p-4 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:leading-6"
                        {...register("client")}
                      />
                    </div>
                    {errors.client && (
                      <span className="text-xs text-red-800">
                        {errors.client.message}
                      </span>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-violet-900">
                      Data
                    </label>
                    <div className="mt-2">
                      <Controller
                        name="appointmentStart"
                        control={control}
                        render={({ field }) => (
                          <DateTimePicker
                            disablePast={true}
                            format={"DD/MM - hh:mm"}
                            views={["day", "month", "hours", "minutes"]}
                            onChange={(date) => field.onChange(date)}
                            className="bg-white rounded-lg w-full text-base"
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-violet-900">
                      Local
                    </label>
                    <div className="mt-2">
                      <select
                        className="block w-full rounded-md text-base border-0 py-4 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:max-w-xs sm:leading-6"
                        {...register("place")}
                      >
                        <option>AG Tattoo e Piercing</option>
                        <option>SKRIPTORIUM</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium leading-6 text-violet-900">
                      Descrição{" "}
                      <span className="text-white text-xs opacity-50">
                        (opcional)
                      </span>
                    </label>
                    <div className="mt-2">
                      <input
                        className="block w-full rounded-md border-0 p-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:leading-6"
                        {...register("description")}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-violet-900">
                      Joias{" "}
                      <span className="text-white text-xs opacity-50">
                        (separar valores por vírgula)
                      </span>
                    </label>
                    <div className="mt-2 relative rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">R$</span>
                      </div>
                      <input
                        placeholder="Exemplo: 150, 200"
                        {...register("jewels")}
                        className="block w-full rounded-md border-0 p-4 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-violet-900">
                      Valor do serviço
                    </label>
                    <div className="mt-2 relative rounded-md">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">R$</span>
                      </div>
                      <input
                        placeholder="Exemplo: 120"
                        {...register("service")}
                        className="block w-full rounded-md border-0 p-4 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:leading-6"
                      />
                    </div>
                    {errors.service && (
                      <span className="text-xs text-red-800">
                        {errors.service.message}
                      </span>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-violet-900">
                      Repasse
                    </label>
                    <div className="mt-2 relative rounded-md">
                      <input
                        placeholder="Exemplo: 40"
                        {...register("rate")}
                        className="block w-full rounded-md border-0 p-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:leading-6"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 sm:text-sm">%</span>
                      </div>
                    </div>
                    {errors.rate && (
                      <span className="text-xs text-red-800">
                        {errors.rate.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex grid grid-cols-1 items-center justify-between gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="flex sm:col-span-3 sm:justify-start justify-center">
                <div className="flex items-center">
                  <div className="text-xs uppercase text-violet-900 font-bold">
                    Total
                  </div>
                  <div className="text-3xl ml-3 font-light text-violet-500">
                    R$ {total}
                  </div>
                  <div className="text-xs text-violet-500 font-bold">,00</div>
                </div>
                <div className="flex items-center ml-5">
                  <div className="text-xs uppercase text-violet-900 font-bold">
                    Lucro
                  </div>
                  <div className="text-3xl ml-3 font-light text-violet-500">
                    R$ {profit}
                  </div>
                  <div className="text-xs text-violet-500 font-bold">,00</div>
                </div>
              </div>
              <div className="flex sm:col-span-3 sm:justify-end justify-center">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 mr-5 px-4 text-gray-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <ImSpinner8 className="animate-spin mr-2" /> Criando...
                    </span>
                  ) : (
                    <>Criar agendamento</>
                  )}
                </button>
              </div>
            </div>
          </form>
        </PageMain>
      </LocalizationProvider>
    </>
  );
};

export default NewAppointmentPage;
