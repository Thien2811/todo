export type Task = {
  id: number;
  listname: string;
  taskname: string;
  description: string;
  user: string;
  datum: string;
  priority: string;
  uuid: string;
  tags: {
    id?: number;
    tagname?: string;
    taskid?: number;
  }[];
  progress: number;
  progressnumber: number;
};
