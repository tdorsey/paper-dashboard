prometheus = {

    host: "https://rtd3.me/prometheus",
    endpoint: "/api/v1/query",
    free_memory: null,
    drive_info: [],
    drives: [],

    loadInfo: function () {

        var p = new Promise(function (resolve, reject) {

            try {
                prometheus.queryZpoolErrors().then(function () {
                    prometheus.queryFreeMemory().then(function () {
                        resolve();
                    });
                });
            }
            catch (e) {
                reject("Error loading data", e);
            }
        });

        return p;
    },

    queryZpoolErrors: function () {

        return new Promise(function (resolve, reject) {

            $.ajax(prometheus.host + prometheus.endpoint,
                {

                    data: {
                        query: 'zpool_error_count'
                    },
                }).then(
                function success(response) {
                    prometheus.drive_info = prometheus.parseZpoolData(response);
                    prometheus.getDriveMetrics(prometheus.drive_info, 5);
                    resolve();

                },
                function fail(data, status) {
                    reject(status);
                });

        });
    },



    queryFreeMemory: function () {
        return new Promise(function (resolve, reject) {
            $.ajax(prometheus.host + prometheus.endpoint,
                {
                    data: {
                        query: 'node_memory_MemFree / node_memory_MemTotal * 100'
                    },
                })
                .then(
                function success(response) {
                    console.log(JSON.stringify(response));

                    var resultObj = prometheus.free_memory = response.data.result[0];

                    var resultAsPercentage =
                        Math.round(resultObj.value[1]) + "%";
                    var timestamp = resultObj.value[0];
                    console.log(timestamp);

                    var utcSeconds = timestamp;
                    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                    d.setUTCSeconds(utcSeconds);

                    $("#free_memory").append(resultAsPercentage);
                    $("#free_memory_updated").append("Updated: " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

                    resolve();
                },

                function fail(data, status) {
                    console.log('Request failed.  Returned status of ' + status);
                    reject(status);
                });

        });
    },

    getFreeMemory: function () {
        return prometheus.free_memory;
    },


    getDriveMetrics: function (driveInfo, numDrives) {

        var drive = {
            device: null,
            timestamp: null,
            readErrors: null,
            writeErrors: null,
            checksumErrors: null,
            totalErrors: null

        };

        driveInfo.forEach(function (info) {

            drive.timestamp = info.value[0];
            drive.totalErrors = info.value[1];
            drive.readErrors = info.metric.read_error_count;
            drive.writeErrors = info.metric.write_error_count;
            drive.checksumErrors = info.metric.checksum_error_count;
            drive.device = prometheus.shortenDeviceName(info.metric.device);
            prometheus.drives.push(drive);

            drive = {};
        });

        sortedDrives = prometheus.drives.sort(function (a, b) {
            return a.totalErrors - b.totalErrors;
        });

    prometheus.drives = prometheus.getArrayMaximumValues(sortedDrives, numDrives);

    },

    getArrayMaximumValues: function (array, numValues) {
      
        array.reverse();
        return array.slice(0, numValues);
    },

    shortenDeviceName: function (device) {
        return device.slice(-5);
    },

    getMetric: function (metric) {

        if (!this.drives) {
            this.queryZpoolErrors();
        }

        if (!prometheus.drives) {
            prometheus.getDriveMetrics(this.drive_info);
        }

        var metrics = [];

        prometheus.drives.forEach(function (drive) {
            metrics.push(drive[metric]);
        });
        return metrics;
    },

    getTotalErrrors: function () {
        return this.getMetric("totalErrors");
    },

    getReadErrors: function () {
        return this.getMetric("readErrors");
    },
    getWriteErrors: function () {
        return this.getMetric("writeErrors");
    },
    getChecksumErrors: function () {
        return this.getMetric("checksumErrors");
    },

    getDriveNames: function () {
        return this.getMetric("device");
    },

    parseZpoolData: function (response) {
        console.log(response);
        return response.data.result;
    },

};
