import * as v from "valibot";
import { MatricNumberSchema } from "../shared/credentials";

export const VerifiedStudentResponseSchema = v.object({
	entity_id: v.string(),
	entity_type_id: v.literal("21"),
	entity_type_name: v.literal("Students"),
	user_name: MatricNumberSchema,
});
export type VerifiedStudentResponseOutput = v.InferOutput<
	typeof VerifiedStudentResponseSchema
>;

export const VerifiedUserResponseSchema = v.object({
	data: v.array(v.union([VerifiedStudentResponseSchema])),
	success: v.literal(1),
});
export type VerifiedUserResponseOutput = v.InferOutput<
	typeof VerifiedUserResponseSchema
>;
