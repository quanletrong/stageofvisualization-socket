'use strict'; // strict mode 

/* > Authentication : */

import {encrypt_data_private_key, token_handshake_time_expire, token_access_time_expire, GLBVARS} from "config-custom";
import { PrivateEncryptData, getDomainFromUrl, DEBUG } from 'admt_utilities';

export default class Authentication {

    handle_callback_middlewares (socket, next) {
        
        // get domain client request
        let domainReq = socket.handshake.headers.hasOwnProperty("origin") ? getDomainFromUrl(socket.handshake.headers.origin) : '';

        // check token
        let tokenReq = socket.handshake.auth.hasOwnProperty("token") ? socket.handshake.auth.token : '';
        
        // acees token
        let clientAccessToken = socket.handshake.auth.hasOwnProperty("access_token") ? socket.handshake.auth.access_token : '';

        let isValidated = false;
        let accessTokenInfo = {
            "actDomain": "",
            "actUid": 0,
            "actCtt": 0,
            "actGid" :0,
        };
        
        let connectUserId = '0'; // current connection userid
        let connectGroupId = '-1'; // current connection user group id
        if(domainReq != '' && tokenReq != '')
        {
            let tokenDecoded = PrivateEncryptData.Decode(tokenReq, encrypt_data_private_key);
            try {
                let tokenData = JSON.parse(tokenDecoded);
                
                let tokenDomain = tokenData.hasOwnProperty("domain") ? tokenData.domain : '';
                let tokenUserId = tokenData.hasOwnProperty("uid") ? tokenData.uid : 0;
                let tokenGroupId = tokenData.hasOwnProperty("gid") ? tokenData.gid : -1;

                tokenUserId = parseInt(tokenUserId);
                tokenUserId =  isNaN(tokenUserId) || typeof(tokenUserId) !== "number" ? 0 : tokenUserId;

                tokenGroupId = parseInt(tokenGroupId);
                tokenGroupId =  isNaN(tokenGroupId) || typeof(tokenGroupId) !== "number" ? -1 : tokenGroupId;

                let tokenTime = tokenData.hasOwnProperty("ctt") ? tokenData.ctt : 0;
                tokenTime = parseInt(tokenTime);
                tokenTime = typeof(tokenTime) == "number" ? tokenTime : 0;
                let currTime = Math.floor(Date.now() / 1000);
                

                //check by access token 
                // sau khi handshake thanh cong => thi làn request tiep theo thi client socket connetion da co access_token
                if(clientAccessToken != '')
                {
                    let accessTokenDecode = JSON.parse(PrivateEncryptData.Decode(clientAccessToken, encrypt_data_private_key));
                    
                    let actDomain = accessTokenDecode.hasOwnProperty("actDomain") ? accessTokenDecode.actDomain : '';
                    let actUserId = accessTokenDecode.hasOwnProperty("actUid") ? accessTokenDecode.actUid : 0;
                    let actGropId = accessTokenDecode.hasOwnProperty("actGid") ? accessTokenDecode.actGid : -1;

                    actUserId = parseInt(actUserId);
                    actUserId =  isNaN(actUserId) || typeof(actUserId) !== "number" ? 0 : actUserId;

                    actGropId = parseInt(actGropId);
                    actGropId =  isNaN(actGropId) || typeof(actGropId) !== "number" ? -1 : actGropId;

                    
                    let actTime = accessTokenDecode.hasOwnProperty("actCtt") ? accessTokenDecode.actCtt : 0;
                    actTime = parseInt(actTime);
                    actTime = typeof(actTime) == "number" ? actTime : 0;

                    if(actDomain == domainReq && actDomain == tokenDomain && actUserId == tokenUserId && actUserId > 0 && actGropId == tokenGroupId  && actTime > 0 && tokenTime > 0)
                    {
                        if((currTime - actTime) <= token_access_time_expire)
                        {
                            isValidated = true;
                            connectUserId = actUserId.toString();
                            connectGroupId = actGropId.toString();
                        }
                    }
                }
                // check by authenticate token
                else
                {
                    // token expire
                    if(tokenDomain == domainReq && tokenUserId > 0 && tokenTime > 0 && (currTime - tokenTime) <= token_handshake_time_expire)
                    {
                        isValidated = true;
                        accessTokenInfo.actDomain = tokenDomain;
                        accessTokenInfo.actUid = tokenUserId;
                        accessTokenInfo.actCtt = tokenTime;
                        accessTokenInfo.actGid = tokenGroupId;
                        
                        connectUserId = tokenUserId.toString();
                        connectGroupId = tokenGroupId.toString();
                    }
                }
            } catch(e) {
                DEBUG(e);
            }
        }
        
        if (isValidated) 
        {
            //DEBUG(socket.nsp.name + '  > pass Authentication ...... ');
            // emit access token to client
            let newAccessToken = PrivateEncryptData.Encode(JSON.stringify(accessTokenInfo), encrypt_data_private_key);
            socket.handshake.auth.access_token = newAccessToken;
            socket.emit('acct', newAccessToken);
            
            // store list connectid map to userid
            GLBVARS.arrConnectIdByUser[socket.id.toString()] = connectUserId;
            
            // store list conenctid of userid
            if(GLBVARS.arrUserConnectId.hasOwnProperty(connectUserId))
            {
                GLBVARS.arrUserConnectId[connectUserId]['cids'].push(socket.id);
            }
            else
            {
                GLBVARS.arrUserConnectId[connectUserId] = {
                    'gid': connectGroupId,
                    'cids': [] // array connection id
                };
                GLBVARS.arrUserConnectId[connectUserId]['cids'].push(socket.id);
            }

            // store list userid of groupid
            if (GLBVARS.arrGroupUserId.hasOwnProperty(connectGroupId))
            {
                if(!GLBVARS.arrGroupUserId[connectGroupId].includes(connectUserId))
                {
                    GLBVARS.arrGroupUserId[connectGroupId].push(connectUserId)
                }
            }
            else 
            {
                GLBVARS.arrGroupUserId[connectGroupId] = [];
                GLBVARS.arrGroupUserId[connectGroupId].push(connectUserId);
            }

            next();
        } else {
            DEBUG( socket.nsp.name + ' > false Authentication ...... ');
            next(new Error('unauthorized'));
        };
    }
    
};