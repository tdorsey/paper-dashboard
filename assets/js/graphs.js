
var graphs = {

    graphInfo: null,

    init: function () {

        return new Promise(function (resolve, reject) {

            var driveStats = {
                labels: prometheus.getDriveNames(),
                series: [
                    prometheus.getReadErrors(),
                    prometheus.getWriteErrors(),
                    prometheus.getChecksumErrors()
                ]
            };

            graphs.graphInfo = driveStats;
            resolve();

        });
    },

    drawGraphs: function () {
        console.log(this.graphInfo);

        new Chartist.Bar('#driveStats', graphs.graphInfo, {
            seriesBarDistance: 10,
            reverseData: true,
            axisY: {
                offset: 70
            }
        });

    },
}