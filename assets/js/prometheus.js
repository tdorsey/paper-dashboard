document.domain = document.domain;
prometheus = {

    host: "https://rtd3.me/prometheus",
    endpoint: "/api/v1/query",
    free_memory: null,

    queryFreeMemory: function (oauthToken) {

        $.ajax(this.host + this.endpoint,
            {
      
            data: {
                query: 'node_memory_MemFree / node_memory_MemTotal * 100'
                },
        })
            .then(
            function success(result) {
                console.log(JSON.stringify(result));
                var resultObj = prometheus.free_memory = prometheus.parseResult(result);

                var resultAsPercentage =
                    Math.round(resultObj.resultVal) + "%";
                var timestamp = resultObj.timestamp;
                console.log(timestamp);

                var utcSeconds = timestamp;
                var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                d.setUTCSeconds(utcSeconds);

                $("#free_memory").append(resultAsPercentage);
                $("#free_memory_updated").append("Updated: " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

            },

            function fail(data, status) {
                console.log('Request failed.  Returned status of ' + status);
            }
            );
    },

    getFreeMemory: function () {
        if (!prometheus.free_memory) {
            prometheus.free_memory = prometheus.queryFreeMemory();

        }

        return prometheus.free_memory;

    },

    parseResult: function (queryResult) {

        var result = {
            timestamp: queryResult.data.result[0].value[0],
            resultVal: queryResult.data.result[0].value[1]
        }

        return result;

    },

};
