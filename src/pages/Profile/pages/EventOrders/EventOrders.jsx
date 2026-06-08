import { getEvents, getEventTypes } from "@/api/eventServices";
import EventOrderCard from "@/components/cards/EventOrderCard";
import MainPagination from "@/components/common/MainPagination";
import SectionTitle from "@/components/common/SectionTitle";
import EmptyDataSection from "@/components/commonSections/EmptyDataSection";
import MyEventsSkeleton from "@/components/Loading/SkeletonLoading/MyEventsSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { RiResetRightLine } from "react-icons/ri";

const EventOrders = () => {
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const date = searchParams.get("date") || "";
  const event_type_id = searchParams.get("event_type_id") || "";

  // events
  const { data: events, isLoading } = useQuery({
    queryKey: ["my_events", page, date, event_type_id],
    queryFn: () => getEvents({ page, date, event_type_id }),
  });

  const isEmpty = !isLoading && (events?.items?.length === 0 || !events);

  // event types
  const { data: eventTypes, isLoading: eventTypesLoading } = useQuery({
    queryKey: ["eventTypes"],
    queryFn: getEventTypes,
  });

  // update filters
  const updateParams = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set("page", 1);

    setSearchParams(params);
  };

  return (
    <div className="space-y-6">
      <SectionTitle title={t("EventOrders.title")} />

      {/* filters */}
      <div
        className={`grid grid-cols-2 gap-2 lg:gap-4 
        p-4 shadow-lg rounded-lg bg-primary/10 items-end
        ${isLoading && "animate-pulse"} 
        ${searchParams.toString() ? "md:grid-cols-3 max-w-xl" : "max-w-sm"}`}
      >
        {/* Event Type */}
        <div>
          <label className="inline-block text-sm ">
            {t("EventOrders.eventType")}
          </label>

          <Select
            value={event_type_id}
            onValueChange={(value) => updateParams("event_type_id", value)}
            disabled={eventTypesLoading}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder={t("EventOrders.selectEventType")} />
            </SelectTrigger>

            <SelectContent>
              {eventTypes?.map((type) => (
                <SelectItem key={type.id} value={String(type.id)}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* date */}
        <div>
          <label className="inline-block text-sm ">
            {t("EventOrders.date")}
          </label>

          <Input
            type="date"
            className="w-full bg-white"
            value={date}
            onChange={(e) => updateParams("date", e.target.value)}
          />
        </div>

        {searchParams.toString() && (
          <Button onClick={() => setSearchParams({})}>
            <RiResetRightLine />

            {t("EventOrders.resetFilters")}
          </Button>
        )}
      </div>

      {/* content */}
      {isLoading ? (
        <MyEventsSkeleton />
      ) : isEmpty ? (
        <EmptyDataSection msg={t("EventOrders.noOrders")} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events?.items?.map((item) => (
            <EventOrderCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* pagination */}
      <MainPagination
        totalPages={events?.meta?.last_page}
        currentPage={page}
        onPageChange={(newPage) => {
          const params = Object.fromEntries(searchParams);
          params.page = newPage;
          setSearchParams(params);
        }}
      />
    </div>
  );
};

export default EventOrders;
