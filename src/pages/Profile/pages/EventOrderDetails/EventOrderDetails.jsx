import { getEvent } from "@/api/eventServices";
import EventDetailsCard from "@/components/cards/EventDetailsCard";
import SectionTitle from "@/components/common/SectionTitle";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { FiCoffee, FiExternalLink } from "react-icons/fi";
import { IoMdTime } from "react-icons/io";
import { LuUserRoundCog, LuUsers } from "react-icons/lu";
import { MdOutlineDateRange } from "react-icons/md";
import { RiDeleteBinLine, RiEdit2Line } from "react-icons/ri";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { openModal } from "@/store/modals/modalsSlice";
import { useDispatch } from "react-redux";
import EventDetailsSkeleton from "@/components/Loading/SkeletonLoading/EventDetailsSkeleton";

const EventOrderDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const dispatch = useDispatch();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEvent(id),
  });

  const list = [
    {
      id: 1,
      label: t("EventOrderDetails.eventType"),
      value: event?.event_type,
      icon: <FiCoffee />,
    },
    {
      id: 2,
      label: t("EventOrderDetails.eventDate"),
      value: event?.date,
      icon: <MdOutlineDateRange />,
    },
    {
      id: 3,
      label: t("EventOrderDetails.schedule"),
      value: `${event?.start_time} - ${event?.end_time}`,
      icon: <IoMdTime />,
    },
    {
      id: 4,
      label: t("EventOrderDetails.attendeeType"),
      value: event?.attendees_gender,
      icon: <LuUserRoundCog />,
    },
  ];

  return (
    <div>
      <div className="flex items-start justify-between">
        <SectionTitle title={t("EventOrderDetails.title")} />

        {!isLoading && (
          <div className="flex items-center gap-2">
            <Button
              size="xs"
              className={`rounded-full md:px-4!`}
              variant="destructive"
              onClick={() =>
                dispatch(
                  openModal({
                    modalName: "DeleteEventOrderModal",
                    modalData: { item_id: id },
                  }),
                )
              }
            >
              <RiDeleteBinLine />
              {t("EventOrderDetails.delete")}
            </Button>

            <Button
              onClick={() =>
                dispatch(
                  openModal({
                    modalName: "UpdateEventModal",
                    modalData: { ...event },
                  }),
                )
              }
              size="xs"
              className={`rounded-full md:px-4!`}
            >
              <RiEdit2Line />
              {t("EventOrderDetails.edit")}
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <EventDetailsSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-2xl shadow flex flex-col gap-2">
              {/* location map */}
              <iframe
                className="w-full h-50 rounded-lg"
                src="https://maps.google.com/maps?q=123+Main+St,+Anytown,+USA&t=&z=13&ie=UTF8&iwloc=&output=embed"
                frameBorder="0"
                allowFullScreen
              ></iframe>

              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  {t("EventOrderDetails.emirate")}
                </p>
                <h3 className="text-xl font-semibold text-primary">
                  {event?.emirate}
                </h3>
              </div>

              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  {t("EventOrderDetails.location")}
                </p>
                <h3 className="text-xl font-semibold text-primary">
                  {event?.location}
                </h3>
              </div>

              {event?.location_link && (
                <a
                  href={event.location_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 underline text-primary"
                >
                  {t("EventOrderDetails.openInGoogleMaps")} <FiExternalLink />
                </a>
              )}
            </div>

            <div className="sm:col-span-2 grid grid-cols-2 gap-4">
              {list.map((item) => (
                <EventDetailsCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div
            className="flex flex-col items-center gap-2 mt-4 max-w-lg mx-auto
          bg-primary text-white rounded-xl shadow p-4"
          >
            <p>{t("EventOrderDetails.expectedAttendees")}</p>

            <span className="text-3xl font-semibold">
              {event?.people_number} {t("EventOrderDetails.pax")}
            </span>

            <p className="flex items-center gap-2 text-sm opacity-80">
              <LuUsers />
              {t("EventOrderDetails.highDensity")}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default EventOrderDetails;
