import { Message } from "@/models/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAccepingMessage?: boolean;
  messages?: Array<Message>;
}
