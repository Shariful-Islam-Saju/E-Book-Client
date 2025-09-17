export * from "./user.type";
export * from "./file.type";
export * from "./lead.type";

export interface TRes<T> {
  success: boolean;
  message: string;
  data?: T;
}
