// hàm thực thi query_store 
export async function query_store(connection, string_query, array_param) {
    return new Promise(function (resolve, reject) {
        connection.query(string_query, array_param, function (error, response) {
            if (error) 
            {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
}