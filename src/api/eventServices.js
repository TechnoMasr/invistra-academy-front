import api from "./api";

export const createEvent = async (formData) => {
  const { data } = await api.post("/event-orders", formData);
  return data?.data;
};

export const getEventSteps = async () => {
  const { data } = await api.get("/event-orders/processing-steps");
  return data?.data || [];
};

export const getEventTypes = async () => {
  const { data } = await api.get("/event-orders/types");
  return data?.data || [];
};

export const getEvents = async ({ page, date, event_type_id }) => {
  const { data } = await api.get("/event-orders", {
    params: {
      page,
      date,
      event_type_id,
    },
  });

  return data?.data;
};

export const getEvent = async (id) => {
  const { data } = await api.get(`/event-orders/${id}`);
  return data?.data || null;
};

export const updateEvent = async (id, formData) => {
  const { data } = await api.post(`/event-orders/${id}`, formData);
  return data?.data || null;
};

export const deleteEvent = async (id) => {
  const { data } = await api.delete(`/event-orders/${id}`);
  return data?.data || null;
};
