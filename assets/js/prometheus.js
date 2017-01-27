
    prometheus = {

        host: "https://prometheus.rtd3.me",
        endpoint: "/api/v1/query",

        getFreeMemory: function (oauthToken) {

            $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                options.crossDomain = {
                    crossDomain: true
                };
                options.xhrFields = {
                    withCredentials: true
                };

                //jqXHR.setRequestHeader('Authorization',
                 //   'Bearer ' + oauthToken.access_token);
            });

            $.ajax(this.host + this.endpoint, {
                data: {
                    query: 'node_memory_MemFree / node_memory_MemTotal * 100'
                }
            })
                .then(
                function success(name) {
                    alert(name);
                },

                function fail(data, status) {
                    console.log('Request failed.  Returned status of ' + status);
                }
                );
        },

    };
