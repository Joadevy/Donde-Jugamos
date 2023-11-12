import * as handlebars from "handlebars";

const NewReservationTemplate = "";

export const compileNewReservationTemplate = (
  name: string,
  eventName: string,
  eventDate: string,
  venueName: string,
  venueAddress: string,
  number: string,
  description: string,
  value: string,
) => {
  const template = handlebars.compile(NewReservationTemplate);
  const htmlBody = template({
    name,
    eventName,
    eventDate,
    venueName,
    venueAddress,
    number,
    description,
    value,
  });

  return htmlBody;
};
