import { ZodIssue } from "zod";

type ActionResults<T> = {status: "success", data:T} 
| {status: "error", error: string | ZodIssue[]}