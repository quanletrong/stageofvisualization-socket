export const GLBVARS = {
    arrGroupUserId: {}, // object luu list cac userid cua 1 group. dung groupid lam key. groupid nay define tu client connection 
    arrUserConnectId: {}, // object lưu các mảng client connnection id theo user id
    arrConnectIdByUser: {}, // object các connection id map tới user id nào
    kafka: null,
    kafkaProducer: null,
    kafkaConsumer: null
};


// object lưu các mảng client connnection id theo user id 
/*
arrUserConnectId = {
    204 : {'gid': user_groupid, 'cids': [12321312, 123123312,123123 ....]},
    202 : {'gid': user_groupid, 'cids': [12321312, 123123312,123123 ....]},
}
arrConnectIdByUser = {
    12321312 : 204
    123123312 : 204 
    123123: 204
    123123: 2233
}

arrGroupUserId {
    g0:[204 , 205]
    g1:[2123, 205]
}

*/