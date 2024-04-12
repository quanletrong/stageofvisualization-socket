// config time key expire
export const token_handshake_time_expire = 300; // 5p
export const token_access_time_expire = 84600; // 1 day

// for push msg
export const MESSAGE_TYPE_KEY_NOTICE_PUSH = 'notice_push';
export const EMIT_TYPE_KEY_NOTICE_PUSH = 'adxmsg';
// for push unread count
export const MESSAGE_TYPE_KEY_NOTICE_UNREAD = 'notice_unread';
export const EMIT_TYPE_KEY_NOTICE_UNREAD = 'adxmsg_unread'; // event name update unread notice

// custom define
export const encrypt_data_private_key = "hcYybzaXjpDW42me";

// for rest notice api
export const URI_PATH_API_NOTICE = '/api';
export const URI_PATH_PUSH_NOTICE = '/push';

export const headers_noticetoken = "noticetoken";

// kafka
export const KAFKA_PRODUCER_CLIENT_ID = 'producer-notice';
export const KAFKA_CONSUMER_GROUP_ID = 'group-notice';
export const KAFKA_NOTICE_TOPPIC = 'notice';

