Vue.createApp({
    data() {
        return {
            checkedCats: [],
            separator: " | ",
            suffix: "",
            command: '',
            preview: '',
            wrs: {},
            commandName: '!wr'
        }
    },
    methods: {
        getWrs() {
            var self = this;
            var xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    self.wrs = JSON.parse(this.responseText);
                    for (const property in self.wrs) {
                        self.wrs[property].prefix = Object.keys(self.wrs[property]).length > 1
                            ? `${property} {v}`
                            : `${property}`;
                    }

                    //Set Defaults
                    self.checkedCats = ['RSG;1.16+', 'SSG;1.16+'];
                    self.buildPreview();
                    self.updateCommand();
                }
            };
            xmlhttp.open("GET", "https://podx12.github.io/MCSRWR/data.json", true);
            xmlhttp.send();
        },
        updateCommand() {
            var self = this;
            var newCommand = `${self.commandName} $(eval var r=$(urlfetch json https://podx12.github.io/MCSRWR/data.json);\``;
            console.log(this.checkedCats);
            self.checkedCats.forEach(res => {
                var splitCats = res.split(";");
                var category = splitCats[0];
                var version = splitCats[1];
                var categoryObj = self.wrs[category];

                var pf = categoryObj.prefix.replace("{v}", version);
                newCommand += `${pf} \${r["${category}"]["${version}"]} ${this.separator}`;
            });

            this.command = `${newCommand.substring(0, newCommand.length - this.separator.length)} ${this.suffix}\`)`;
            this.buildPreview();
        },
        buildPreview() {

            var self = this;
            if (!this.wrs["RSG"])
                return;
            var newPreview = "";

            self.checkedCats.forEach(res => {
                var splitCats = res.split(";");
                var category = splitCats[0];
                var version = splitCats[1];
                var categoryObj = self.wrs[category];

                var pf = categoryObj.prefix.replace("{v}", version);
                newPreview += `${pf} ${self.wrs[category][version]} ${this.separator}`;
            });

            this.preview = `${newPreview.substring(0, newPreview.length - this.separator.length)} ${this.suffix}`;
        }
    },
    mounted() {
        this.getWrs();
    }
}).mount('#app')