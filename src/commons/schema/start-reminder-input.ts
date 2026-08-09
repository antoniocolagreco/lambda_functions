import * as v from "valibot"

const StartReminderInputSchema = v.object({
	waitSeconds: v.pipe(v.number(), v.integer(), v.minValue(0)),
	message: v.pipe(v.string(), v.minLength(1)),
	email: v.pipe(v.string(), v.email()),
})

type StartReminderInput = v.InferOutput<typeof StartReminderInputSchema>

export { type StartReminderInput, StartReminderInputSchema }
