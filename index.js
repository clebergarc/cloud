"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const google_auth_library_1 = require("google-auth-library");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/webhook", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const prompt = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.prompt) || "Olá";
        const auth = new google_auth_library_1.GoogleAuth({
            scopes: "https://www.googleapis.com/auth/cloud-platform",
        });
        const client = yield auth.getClient();
        const projectId = yield auth.getProjectId();
        const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/gemini-1.5-flash:streamGenerateContent`;
        const vertexBody = {
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }],
                },
            ],
        };
        const response = yield client.request({
            url: endpoint,
            method: "POST",
            data: vertexBody,
        });
        const result = ((_e = (_d = (_c = (_b = response.data.candidates) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.content.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text) || "Erro ao gerar resposta.";
        res.json({ resposta: result });
    }
    catch (error) {
        console.error(error);
        const errorMessage = (error instanceof Error) ? error.message : "Erro interno";
        res.status(500).send({ error: errorMessage });
    }
}));
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor ouvindo na porta ${PORT}`);
});
