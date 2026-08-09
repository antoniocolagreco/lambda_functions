import * as v from "valibot"

const TaskInputSchema = v.object({
	email: v.pipe(v.string(), v.email()),
	message: v.pipe(v.string(), v.minLength(1)),
})

type TaskInput = v.InferOutput<typeof TaskInputSchema>

const EventWithTaskInputSchema = v.object({
	Input: TaskInputSchema,
})

type EventWithTaskInput = v.InferOutput<typeof EventWithTaskInputSchema>

export {
	type EventWithTaskInput,
	EventWithTaskInputSchema,
	type TaskInput,
	TaskInputSchema,
}
