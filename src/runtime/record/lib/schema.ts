import z from "zod";

export const EnvRecordSchema = z.record(z.string(), z.unknown());
