import crypto from 'crypto';

export function Encode (str, private_key){
    let iv = private_key.split("").reverse().join("");
    let encrypt_key = crypto.createHmac('sha256', iv).update(private_key, "utf-8").digest("hex");
    let encrypt_key_len = encrypt_key.length;
    if(encrypt_key_len > 32)
    {
        encrypt_key = encrypt_key.substr(0,32);
    }
    else if(encrypt_key < 32)
    {
        let n = 32 - encrypt_key_len;
        for(let i = 0; i < n; i++)
        {
            encrypt_key += " ";
        }
    }

    let cipher = crypto.createCipheriv('AES-256-CBC', encrypt_key, iv);
	let encrypted_str = cipher.update(str, 'utf8', 'base64', 'utf8');
    
    encrypted_str += cipher.final('base64');

    encrypted_str = encrypted_str.replace(/\+/gi, "-");
    encrypted_str = encrypted_str.replace(/\//gi, "_");

    return encrypted_str;
}

// key lengh = 32
export function Decode (str_encrypted, private_key){
    let iv = private_key.split("").reverse().join("");
    let encrypt_key = crypto.createHmac('sha256', iv).update(private_key, "utf-8").digest("hex");
    let encrypt_key_len = encrypt_key.length;
    if(encrypt_key_len > 32)
    {
        encrypt_key = encrypt_key.substr(0,32);
    }
    else if(encrypt_key < 32)
    {
        let n = 32 - encrypt_key_len;
        for(let i = 0; i < n; i++)
        {
            encrypt_key += " ";
        }
    }

    str_encrypted = str_encrypted.replace(/-/gi, "+");
	str_encrypted = str_encrypted.replace(/_/gi, "/");

    let decipher = crypto.createDecipheriv('AES-256-CBC', encrypt_key, iv);
	let str_decrypted = decipher.update(str_encrypted, 'base64', 'utf8');
	str_decrypted += decipher.final('utf8');

    return str_decrypted;
}