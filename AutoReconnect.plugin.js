/**
 * @name AutoReconnect
 * @version 1.2
 * @description Reconecta automaticamente a um canal específico ao ser desconectado.
 * @author iykhiro
 */

const AutoReconnect = (() => {
    const CHANNEL_ID = "1274835405384056913";

    return class {
        start() {
            try {
                this.VoiceStateModule = BdApi.findModuleByProps("getVoiceStates");
                this.VoiceModule = BdApi.findModuleByProps("selectVoiceChannel");
                this.CurrentUserModule = BdApi.findAllModules((m) => m.getCurrentUser).find((mod) => mod.getCurrentUser);

                if (!this.VoiceStateModule || !this.VoiceModule || !this.CurrentUserModule) {
                    throw new Error("Um ou mais módulos necessários não foram encontrados.");
                }

                this.monitorInterval = setInterval(() => this.checkAndReconnect(), 10000);
                console.log("AutoReconnect iniciado com sucesso.");
            } catch (error) {
                console.error("Erro ao iniciar o AutoReconnect:", error.message);
            }
        }

        stop() {
            console.log("AutoReconnect desativado.");
            if (this.monitorInterval) {
                clearInterval(this.monitorInterval);
            }
        }

        checkAndReconnect() {
            try {
                const currentUserId = this.CurrentUserModule.getCurrentUser().id;
                const voiceStates = this.VoiceStateModule.getVoiceStates();

                const isInChannel = Object.values(voiceStates).some(
                    (state) => state.channelId === CHANNEL_ID && state.userId === currentUserId
                );

                if (!isInChannel) {
                    console.log("Tentando reconectar ao canal de voz...");
                    this.reconnectToChannel();
                }
            } catch (error) {
                console.error("Erro ao verificar estado de conexão:", error.message);
            }
        }

        reconnectToChannel() {
            try {
                if (!this.VoiceModule) {
                    throw new Error("Módulo de voz não está disponível.");
                }

                this.VoiceModule.selectVoiceChannel(CHANNEL_ID);
                console.log(`Reconectado com sucesso ao canal de voz ${CHANNEL_ID}.`);
            } catch (error) {
                console.error("Erro ao tentar reconectar ao canal:", error.message);
            }
        }
    };
})();