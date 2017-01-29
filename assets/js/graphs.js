
var graphs = {

    graphInfo: null,

    init: function () {

        return new Promise(function (resolve, reject) {

            var driveStats = {
                labels: prometheus.getShortDriveNames(),
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

    drawGraph: function (id) {

        id = "#" + id;
        console.log(this.graphInfo);

        new Chartist.Bar(id, graphs.graphInfo, {
            stackBars: true,
            reverseData: true,
            axisY: {
                offset: 70
            }
        });

    },
}