export interface Notification {
  id: number;
  userId: string;
  readed: boolean;
  title: string;
  message: string;
  typeId: number;
  date: Date;
}
