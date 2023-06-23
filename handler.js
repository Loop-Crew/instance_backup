// Note : to enable Common JS (require, module.exports etc...) in Node >= 16 runtimes
// you have to push your package.json, this can be done with Scaleway Serverless framework
// documentation here : https://github.com/scaleway/serverless-scaleway-functions

import axios from 'axios';

export {handle};

function handle (event, context, cb) {
    let api_url = 'https://api.scaleway.com';
    let api_key = process.env.API_KEY;
    let project_id = process.env.PROJECT_ID;
    let zone = process.env.ZONE;
    let volume_id = process.env.VOLUME_ID;

    let needsBackup = true;

    axios({
        method: 'get',
        url: `/instance/v1/zones/${zone}/snapshots`,
        baseURL: api_url,
        headers: {
            'X-Auth-Token': api_key,
        },
        data: {
            public: false
        },
        responseType: 'json',
    })
        .then(response => {
            let snapshots = response.data.snapshots;
            for (let snapshot of snapshots) {
                if (snapshot.base_volume !== null && volume_id === snapshot.base_volume.id) {
                    let diff = new Date().getTime() - new Date(snapshot.creation_date).getTime();
                    let dayDiff = diff / 86400000;
                    if (dayDiff >= 7) {
                        axios({
                            method: 'delete',
                            url: '/instance/v1/zones/{zone}/snapshots/{snapshot_id}'
                                .replace('{zone}', zone)
                                .replace('{snapshot_id}', snapshot.id),
                            baseURL: api_url,
                            headers: {
                                'X-Auth-Token': api_key,
                            },
                            data: {
                            },
                            responseType: 'json',
                        })
                            .then(response => {
                                console.log('Snapshot deleted successfully!');
                            }).catch((reason => {
                            console.log('Error during snapshot deletion')
                            console.log(reason);
                        }));
                    }
                    if (needsBackup && dayDiff < 1) {
                        needsBackup = false;
                    }
                }
            }

            if (needsBackup) {
                console.log('Start creating snapshot');
                axios({
                    method: "post",
                    url: "/instance/v1/zones/{zone}/snapshots".replace('{zone}', zone),
                    baseURL: api_url,
                    headers: {
                        'X-Auth-Token': api_key,
                    },
                    data: {
                        'name': 'automatic',
                        'volume_id': volume_id,
                        'project': project_id,
                    },
                    responseType: 'json',
                })
                    .then(response => {
                        console.log('Snapshot created successfully!');
                    }).catch((reason => {
                    console.log('Error during snapshot creation')
                    console.log(reason);
                }));
            }

        }).catch((reason => {
        console.log(reason)
    }));
    
    return {
        body: JSON.stringify({
            message: 'done',
        }),
        statusCode: 200,
    };
};

// // For testing purposes
// import { pathToFileURL } from "url";

// if (import.meta.url === pathToFileURL(process.argv[1]).href) {
//     import("@scaleway/serverless-functions").then(scw_fnc_node => {
//       scw_fnc_node.serveHandler(handle, 8080);
//     });
// }
