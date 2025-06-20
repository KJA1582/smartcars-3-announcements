import axios from "axios";

export interface Plugin {
    id: string;
    name: string;
    version: string;
    type: string;
    description: string;
    ui: boolean;
}

export default class LocalAPI {
    static async getPluginSettings(pluginId: string): Promise<any> {
        const response = await axios.get(
            `http://localhost:7172/api/settings/${pluginId}`,
        );

        return response.data;
    }

    static async log(message: string, level: string) {
        const event = {
            message,
            level,
        };

        return axios({
            url: "http://localhost:7172/api/log",
            method: "POST",
            data: event,
            headers: {
                "Content-Type": "application/json",
            },
        }).catch((error) => {
            console.error("Axios error sending log item", event, error);
        });
    }

    static async playSound(url: string) {
        return axios
            .post("http://localhost:7172/api/play-sound", {
                url,
            })
            .catch(() => {});
    }

    static async stopSound() {
        return axios
            .post("http://localhost:7172/api/stop-sound")
            .catch(() => {});
    }

    static async isPluginInstalled(pluginId: string): Promise<boolean> {
        try {
            const response = await axios.get(
                "http://localhost:7172/api/plugins/installed",
            );

            const data = response.data as Plugin[];
            if (!data.find((plugin: Plugin) => plugin.id === pluginId)) {
                return false;
            }
            return true;
        } catch (error: any) {
            return false;
        }
    }
}
