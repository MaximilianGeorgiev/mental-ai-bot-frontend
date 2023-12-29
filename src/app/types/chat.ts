export interface Conversation {
    _id?: string | object;
    dateCreated: Date;
    messages: Message[];
    title: string;
    isArchived: boolean;
    userId?: string;
    isGuest: boolean;
};

export interface Message {
    _id?: string | object;
    timestamp: Date;
    message: string;
    type: string;
    response?: Message;
    userId?: string;
}