import { z } from "zod";

export type FieldErrors<T> = {
  [k in keyof T]?: string[];
};

export type ActionState<TInput, TOutput> = {
  fieldErrors?: FieldErrors<TInput>;
  error?: string | null;
  data?: TOutput;
};

export const createSafeAction = <TInput, TOuput>(
  schema: z.Schema<TInput>,
  handler: (validationData: TInput) => Promise<ActionState<TInput, TOuput>>
) => {
  return async (data: TInput): Promise<ActionState<TInput, TOuput>> => {
    const validatationResult = schema.safeParse(data);
    if (!validatationResult.success) {
      return {
        fieldErrors: validatationResult.error.flatten()
          .fieldErrors as FieldErrors<TInput>,
      };
    }

    return handler(validatationResult.data);
  };
};
