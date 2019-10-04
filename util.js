const { exec } = require("child_process");

class Util {
    static exec(cmd) {
        return new Promise((resolve, reject) => {
            exec(cmd, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                } else if (stderr) {
                    reject(stderr);
                } else {
                    resolve(stdout);
                }
            });
        });
    }

    static async listSessions() {
        const vars = [
            "session_id",
            "window_index",
            "pane_index",
            "pane_width",
            "pane_height",
            "pane_left",
            "pane_top",
            "pane_right",
            "pane_bottom",
            "pane_active"
        ];
        const format = vars.map(v => `#{${v}}`).join("|");
        const sessions = {};
        (await Util.exec(`tmux list-panes -a -F "${format}"`))
            .trim()
            .split("\n")
            .map(line => {
                const spl = line.split("|");
                const obj = {};
                vars.forEach((v, idx) => {
                    obj[v] = spl[idx];
                });
                return obj;
            })
            .forEach(obj => {
                if (!(obj.session_id in sessions))
                    sessions[obj.session_id] = {};
                const session = sessions[obj.session_id];

                if (!(obj.window_index in session)) session[obj.window_index] = {};
                const window = session[obj.window_index];

                const pane = {
                    active: obj.pane_active === "1"
                };
                ["width", "height", "left", "top", "right", "bottom"].forEach(
                    key => {
                        pane[key] = obj[`pane_${key}`];
                    }
                );
                window[obj.pane_index] = pane;
            });
        return sessions;
    }
}

module.exports = Util;
