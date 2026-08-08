import { Document } from 'mongoose';
export type TaskDocument = Task & Document;
export declare class Member {
    name: string;
    avatar?: string;
    role?: string;
}
export declare class Subtask {
    id: string;
    title: string;
    priority: string;
    members: Member[];
    dueDate?: string;
    completed: boolean;
}
export declare class Comment {
    id: string;
    authorName: string;
    authorAvatar?: string;
    content: string;
    attachments: string[];
    createdAt: string;
}
export declare class ActivityLog {
    id: string;
    text: string;
    timestamp: string;
}
export declare class Task {
    title: string;
    description?: string;
    status: string;
    priority: string;
    members: Member[];
    dueDate?: string;
    labels: string[];
    teams: string[];
    reporter?: string;
    project?: string;
    resources: {
        title: string;
        url: string;
    }[];
    subtasks: Subtask[];
    comments: Comment[];
    activityLogs: ActivityLog[];
    userId?: string;
}
export declare const TaskSchema: import("mongoose").Schema<Task, import("mongoose").Model<Task, any, any, any, Document<unknown, any, Task, any, {}> & Task & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Task, Document<unknown, {}, import("mongoose").FlatRecord<Task>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Task> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
