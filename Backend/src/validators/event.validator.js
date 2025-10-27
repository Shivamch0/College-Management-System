import Joi from "joi";

const eventValidationSchema = Joi.object({
    title: Joi.string().min(3).max(100).required("Title is required..."),
    description: Joi.string().max(1000).optional(),
    date: Joi.date().iso().required("Date is required..."),
    venue: Joi.string().min(3).max(200).required("Venue is required..."),
    eventType: Joi.string().optional(),
    maxParticipants: Joi.optional(),
});

const eventUpdateValidationSchema = eventValidationSchema.fork(
  ["title", "date", "venue"],
  (schema) => schema.optional()
);

export { eventValidationSchema  , eventUpdateValidationSchema};