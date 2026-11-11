import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type DefaultValues, type FieldValues } from "react-hook-form";
import type { z } from "zod";

export function useZodForm<TSchema extends z.ZodType<FieldValues, FieldValues>>(
    schema: TSchema,
    defaultValues: DefaultValues<z.input<TSchema>>,
) {
    return useForm<z.input<TSchema>, unknown, z.output<TSchema>>({
        resolver: zodResolver(schema),
        defaultValues,
    });
}
