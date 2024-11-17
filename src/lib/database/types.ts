import { customType } from "drizzle-orm/sqlite-core";

export const enumType = <V extends Record<string, number | string>>(
      columnName: string,
      enumObj: V,
      message?: string,
) => {
      // Filter enum values to only include numeric entries
      const numericValues = Object.values(enumObj).filter(
            (value): value is number => typeof value === "number",
      );

      const colFn = customType<{
            data: V[keyof V]; // Enum values as data type
            driverData: number; // Stored as integers in the database
      }>({
            dataType() {
                  return "integer";
            },
            toDriver(value: V[keyof V]): number {
                  if (!numericValues.includes(value as number)) {
                        throw new Error(
                              message ??
                              `Invalid value for column "${columnName}". Expected: ${numericValues.join(
                                    ", ",
                              )} | Found: ${value}`,
                        );
                  }
                  return value as number;
            },
            fromDriver(value: number): V[keyof V] {
                  if (!numericValues.includes(value)) {
                        throw new Error(
                              `Invalid enum value from database for column "${columnName}". Found: ${value}`,
                        );
                  }
                  return value as V[keyof V];
            },
      });

      return colFn(columnName).$type<V[keyof V]>();
};